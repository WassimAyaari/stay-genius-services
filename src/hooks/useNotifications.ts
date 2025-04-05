
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useTableReservations } from '@/hooks/useTableReservations';
import { useSpaBookings } from '@/hooks/useSpaBookings';
import { useEventReservations } from '@/hooks/useEventReservations';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { NotificationItem } from '@/types/notification';
import { useNotificationsState } from './notifications/useNotificationsState';
import { useNotificationsRealtime } from './notifications/useNotificationsRealtime';
import { combineAndSortNotifications } from './notifications/notificationUtils';
import { useEffect } from 'react';

export const useNotifications = () => {
  const { user, userData } = useAuth();
  const userId = user?.id || localStorage.getItem('user_id');
  const userEmail = user?.email || localStorage.getItem('user_email');
  const userRoomNumber = userData?.room_number || localStorage.getItem('user_room_number');
  
  // Get service requests, table reservations, spa bookings and event reservations
  const { data: serviceRequests = [], refetch: refetchServices } = useServiceRequests();
  const { reservations: tableReservations = [], refetch: refetchTableReservations } = useTableReservations();
  const { bookings: spaBookings = [], refetch: refetchSpaBookings } = useSpaBookings();
  const { reservations: eventReservations = [], refetch: refetchEventReservations } = useEventReservations();
  
  // Get notification state management
  const { hasNewNotifications, setHasNewNotifications } = useNotificationsState();
  
  // Store email in localStorage for future reference
  useEffect(() => {
    if (user?.email && !localStorage.getItem('user_email')) {
      localStorage.setItem('user_email', user.email);
    }
  }, [user?.email]);
  
  // Force a reload only once on mount to avoid excessive refetching
  useEffect(() => {
    const fetchInitialData = async () => {
      // Use Promise.all to fetch all data in parallel
      await Promise.all([
        refetchServices(),
        refetchTableReservations(),
        refetchSpaBookings(),
        refetchEventReservations()
      ]);
    };
    
    fetchInitialData();
  }, [refetchServices, refetchTableReservations, refetchSpaBookings, refetchEventReservations]);
  
  // Set up real-time notification listeners
  useNotificationsRealtime(
    userId,
    userEmail,
    userRoomNumber,
    refetchTableReservations,
    refetchServices,
    refetchSpaBookings,
    refetchEventReservations,
    setHasNewNotifications
  );

  // Combine and sort notifications
  const notifications: NotificationItem[] = combineAndSortNotifications(
    serviceRequests,
    tableReservations,
    spaBookings,
    eventReservations
  );

  // Count unread notifications
  const unreadCount = notifications.filter(n => 
    n.status === 'pending' || n.status === 'in_progress' || n.status === 'confirmed'
  ).length;

  const isAuthenticated = Boolean(userId);

  return {
    notifications,
    unreadCount,
    isAuthenticated,
    hasNewNotifications,
    setHasNewNotifications,
    refetchServices,
    refetchTableReservations,
    refetchSpaBookings,
    refetchEventReservations
  };
};
