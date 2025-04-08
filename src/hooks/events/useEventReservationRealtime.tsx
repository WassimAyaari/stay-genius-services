
import { useEffect } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for setting up real-time listeners for event reservations
 */
export const useEventReservationRealtime = (
  queryClient: QueryClient,
  userId?: string | null,
  userEmail?: string | null,
  eventId?: string,
  isEventSpecific?: boolean
) => {
  useEffect(() => {
    if (!queryClient) return;

    const channels = [];
    
    if (isEventSpecific) {
      // For admin view of event reservations
      console.log(`Setting up real-time listener for event reservations: ${eventId}`);
      
      const eventChannel = supabase
        .channel('event_reservations')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'event_reservations',
          filter: `event_id=eq.${eventId}`,
        }, (payload) => {
          console.log('Event reservation update received:', payload);
          queryClient.invalidateQueries({ queryKey: ['eventReservations', userId, userEmail, eventId] });
          
          // Show notification for new reservations
          if (payload.eventType === 'INSERT') {
            toast.info(`Nouvelle réservation`, {
              description: `Une nouvelle réservation a été créée.`,
              duration: 5000,
            });
          }
        })
        .subscribe();
        
      channels.push(eventChannel);
    } else if (userId || userEmail) {
      // Set up channels for user's own reservations
      console.log("Setting up real-time listener for user event reservations");
      
      if (userId) {
        const userIdChannel = supabase
          .channel('event_reservation_updates_userId')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'event_reservations',
            filter: `user_id=eq.${userId}`,
          }, (payload) => {
            console.log('Event reservation update received by user_id:', payload);
            handleReservationUpdate(payload);
          })
          .subscribe();
          
        channels.push(userIdChannel);
      }
      
      if (userEmail) {
        const emailChannel = supabase
          .channel('event_reservation_updates_email')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'event_reservations',
            filter: `guest_email=eq.${userEmail}`,
          }, (payload) => {
            console.log('Event reservation update received by email:', payload);
            handleReservationUpdate(payload);
          })
          .subscribe();
          
        channels.push(emailChannel);
      }
    }
      
    const handleReservationUpdate = (payload: any) => {
      // For new reservations
      if (payload.eventType === 'INSERT') {
        toast.info(`Nouvelle réservation`, {
          description: `Votre réservation à l'événement a été créée avec succès.`,
          duration: 5000,
        });
        queryClient.invalidateQueries({ queryKey: ['eventReservations', userId, userEmail, eventId] });
        return;
      }
      
      // For status updates
      if (payload.eventType === 'UPDATE') {
        const oldStatus = payload.old.status;
        const newStatus = payload.new.status;
        
        // Only notify if the status has changed
        if (oldStatus !== newStatus) {
          // Show a toast notification
          toast.info(`Mise à jour de réservation`, {
            description: `Votre réservation est maintenant ${getStatusFrench(newStatus)}.`,
            duration: 5000,
          });
        }
        
        // Refetch the reservations to update the UI
        queryClient.invalidateQueries({ queryKey: ['eventReservations', userId, userEmail, eventId] });
      }
    };

    // Helper function for getting status in French
    const getStatusFrench = (status: string) => {
      switch (status) {
        case 'confirmed': return 'confirmée';
        case 'cancelled': return 'annulée';
        case 'pending': return 'en attente';
        default: return status;
      }
    };
      
    return () => {
      console.log("Cleaning up real-time listener for event reservations");
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [userId, userEmail, queryClient, eventId, isEventSpecific]);
};
