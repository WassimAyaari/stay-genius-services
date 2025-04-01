
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useTableReservations } from '@/hooks/useTableReservations';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { toast } from 'sonner';
import { ServiceRequest } from '@/features/rooms/types';
import { TableReservation } from '@/features/dining/types';

// Define a type for the combined notification items
export type NotificationItem = {
  id: string;
  type: 'request' | 'reservation';
  title: string;
  description: string;
  status: string;
  time: Date;
  link: string;
  data: ServiceRequest | TableReservation;
};

export const useNotificationsData = () => {
  const { user, userData } = useAuth();
  const { 
    data: serviceRequests = [], 
    isLoading: isLoadingRequests, 
    refetch: refetchRequests 
  } = useServiceRequests();
  
  const { 
    reservations = [], 
    isLoading: isLoadingReservations, 
    refetch: refetchReservations 
  } = useTableReservations();
  
  const userId = user?.id || localStorage.getItem('user_id');
  const userEmail = user?.email || localStorage.getItem('user_email');

  // Force refetch on mount to ensure we have the latest data
  useEffect(() => {
    refetchRequests();
    refetchReservations();
    
    // Store email in localStorage for future reference
    if (user?.email && !localStorage.getItem('user_email')) {
      localStorage.setItem('user_email', user.email);
    }
    if (userData?.email && !localStorage.getItem('user_email')) {
      localStorage.setItem('user_email', userData.email);
    }
  }, [refetchRequests, refetchReservations, user?.email, userData?.email]);

  // Effet pour rafraîchir les données en temps réel
  useEffect(() => {
    if (!userId && !userEmail) {
      console.log("No user ID or email found, not setting up real-time listeners");
      return;
    }
    
    console.log("Setting up real-time listeners with user ID:", userId, "and email:", userEmail);
    
    const channels = [];
    
    // Écouter les mises à jour de réservations par ID
    if (userId) {
      const reservationChannel = supabase
        .channel('notifications_page_reservation_updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'table_reservations',
          filter: `user_id=eq.${userId}`,
        }, (payload) => {
          console.log('Notification page - reservation update received by ID:', payload);
          
          // Show notification for status changes
          if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
            const statusMap: Record<string, string> = {
              'pending': 'est en attente',
              'confirmed': 'a été confirmée',
              'cancelled': 'a été annulée'
            };
            
            const status = payload.new.status;
            const message = statusMap[status] || 'a été mise à jour';
            
            const date = new Date(payload.new.date).toLocaleDateString('fr-FR');
            const time = payload.new.time;
            
            toast.info(`Mise à jour de réservation`, {
              description: `Votre réservation de table pour le ${date} à ${time} ${message}.`
            });
          }
          
          refetchReservations();
        })
        .subscribe();
      
      channels.push(reservationChannel);
    }
    
    // Écouter aussi par email si disponible
    if (userEmail) {
      const emailChannel = supabase
        .channel('notifications_page_email_updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'table_reservations',
          filter: `guest_email=eq.${userEmail}`,
        }, (payload) => {
          console.log('Notification page - reservation email update received:', payload);
          
          // Show notification for status changes
          if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
            const statusMap: Record<string, string> = {
              'pending': 'est en attente',
              'confirmed': 'a été confirmée',
              'cancelled': 'a été annulée'
            };
            
            const status = payload.new.status;
            const message = statusMap[status] || 'a été mise à jour';
            
            const date = new Date(payload.new.date).toLocaleDateString('fr-FR');
            const time = payload.new.time;
            
            toast.info(`Mise à jour de réservation`, {
              description: `Votre réservation de table pour le ${date} à ${time} ${message}.`
            });
          }
          
          refetchReservations();
        })
        .subscribe();
      
      channels.push(emailChannel);
    }
    
    // Écouter les mises à jour de demandes de service
    if (userId) {
      const serviceRequestChannel = supabase
        .channel('notifications_page_service_updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'service_requests',
          filter: `guest_id=eq.${userId}`,
        }, (payload) => {
          console.log('Notification page - service request update received:', payload);
          
          // Show notification for status changes
          if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
            const statusMap: Record<string, string> = {
              'pending': 'est en attente',
              'in_progress': 'est en cours de traitement',
              'completed': 'a été complétée',
              'cancelled': 'a été annulée'
            };
            
            const status = payload.new.status;
            const message = statusMap[status] || 'a été mise à jour';
            
            toast.info(`Mise à jour de demande`, {
              description: `Votre demande de type ${payload.new.type} ${message}.`
            });
          }
          
          refetchRequests();
        })
        .subscribe();
      
      channels.push(serviceRequestChannel);
    }
    
    return () => {
      console.log("Cleaning up real-time listeners for notifications page");
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [userId, userEmail, refetchReservations, refetchRequests]);

  // Combine and sort notifications by time (newest first)
  const notifications: NotificationItem[] = [
    ...serviceRequests.map(request => ({
      id: request.id,
      type: 'request' as const,
      title: `Demande de service`,
      description: request.type,
      status: request.status,
      time: new Date(request.created_at),
      link: `/requests/${request.id}`,
      data: request
    })),
    ...reservations.map(reservation => ({
      id: reservation.id,
      type: 'reservation' as const,
      title: `Réservation de table`,
      description: `${reservation.guests} personnes le ${new Date(reservation.date).toLocaleDateString('fr-FR')} à ${reservation.time}`,
      status: reservation.status,
      time: new Date(reservation.createdAt),
      link: `/reservations/${reservation.id}`,
      data: reservation
    }))
  ].sort((a, b) => b.time.getTime() - a.time.getTime());

  const isLoading = isLoadingRequests || isLoadingReservations;
  const isAuthenticated = Boolean(user || localStorage.getItem('user_id'));

  return {
    notifications,
    isLoading,
    isAuthenticated,
    userId,
    userEmail
  };
};
