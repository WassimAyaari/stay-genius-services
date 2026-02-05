import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminDashboardStats {
  totalReservations: number;
  tableReservations: number;
  spaBookings: number;
  eventReservations: number;
  messagesCount: number;
  currentGuests: number;
  activeEvents: number;
  serviceRequests: {
    total: number;
    pending: number;
    completed: number;
  };
  guestSatisfaction: number;
  conversationsCount: number;
  todayActivity: {
    newReservations: number;
    newMessages: number;
    unansweredMessages: number;
  };
}

const fetchDashboardStats = async (): Promise<AdminDashboardStats> => {
  const today = new Date().toISOString().split('T')[0];
  
  // Fetch all data in parallel
  const [
    tableReservationsResult,
    spaBookingsResult,
    eventReservationsResult,
    messagesResult,
    guestsResult,
    eventsResult,
    serviceRequestsResult,
    feedbackResult,
    conversationsResult,
    todayReservationsResult,
    todayMessagesResult,
    unansweredMessagesResult
  ] = await Promise.all([
    // Table reservations count
    supabase.from('table_reservations').select('*', { count: 'exact', head: true }),
    // Spa bookings count
    supabase.from('spa_bookings').select('*', { count: 'exact', head: true }),
    // Event reservations count
    supabase.from('event_reservations').select('*', { count: 'exact', head: true }),
    // Messages count
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    // Current guests (check_out_date >= today)
    supabase.from('guests').select('*', { count: 'exact', head: true }).gte('check_out_date', today),
    // Active events (date >= today)
    supabase.from('events').select('*', { count: 'exact', head: true }).gte('date', today),
    // Service requests by status
    supabase.from('service_requests').select('status'),
    // Average guest satisfaction
    supabase.from('guest_feedback').select('rating'),
    // Conversations count
    supabase.from('conversations').select('*', { count: 'exact', head: true }),
    // Today's reservations (all types)
    supabase.from('table_reservations').select('*', { count: 'exact', head: true }).eq('date', today),
    // Today's messages
    supabase.from('messages').select('*', { count: 'exact', head: true }).gte('created_at', `${today}T00:00:00`),
    // Unanswered messages (conversations with status 'active' and current_handler = 'ai')
    supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('status', 'active').eq('current_handler', 'ai')
  ]);

  // Calculate service request stats
  const serviceRequests = serviceRequestsResult.data || [];
  const pendingCount = serviceRequests.filter(r => r.status === 'pending').length;
  const completedCount = serviceRequests.filter(r => r.status === 'completed').length;

  // Calculate average rating
  const ratings = feedbackResult.data || [];
  const avgRating = ratings.length > 0 
    ? ratings.reduce((sum, f) => sum + (f.rating || 0), 0) / ratings.length 
    : 0;

  return {
    totalReservations: (tableReservationsResult.count || 0) + (spaBookingsResult.count || 0) + (eventReservationsResult.count || 0),
    tableReservations: tableReservationsResult.count || 0,
    spaBookings: spaBookingsResult.count || 0,
    eventReservations: eventReservationsResult.count || 0,
    messagesCount: messagesResult.count || 0,
    currentGuests: guestsResult.count || 0,
    activeEvents: eventsResult.count || 0,
    serviceRequests: {
      total: serviceRequests.length,
      pending: pendingCount,
      completed: completedCount
    },
    guestSatisfaction: Math.round(avgRating * 10) / 10,
    conversationsCount: conversationsResult.count || 0,
    todayActivity: {
      newReservations: todayReservationsResult.count || 0,
      newMessages: todayMessagesResult.count || 0,
      unansweredMessages: unansweredMessagesResult.count || 0
    }
  };
};

export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};
