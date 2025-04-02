
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Sets up real-time listeners for notifications
 */
export const useRealtimeNotifications = (
  userId: string | null | undefined,
  userEmail: string | null | undefined,
  userRoomNumber: string | null | undefined,
  refetchRequests: () => void,
  refetchReservations: () => void
) => {
  // Real-time listeners for notifications
  useEffect(() => {
    if (!userId && !userEmail && !userRoomNumber) {
      console.log("No user ID, email or room number found, not setting up real-time listeners");
      return;
    }
    
    console.log("Setting up real-time listeners with user ID:", userId, "email:", userEmail, "and room number:", userRoomNumber);
    
    const channels = [];
    
    // Listen for reservation updates by ID
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
    
    // Listen by email if available
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
    
    // Listen for service request updates by user ID
    if (userId) {
      const serviceRequestChannel = supabase
        .channel('notifications_page_service_updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'service_requests',
          filter: `guest_id=eq.${userId}`,
        }, (payload) => {
          console.log('Notification page - service request update received by user ID:', payload);
          
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

    // Listen for service request updates by room number
    if (userRoomNumber) {
      const roomServiceChannel = supabase
        .channel('notifications_page_room_service_updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'service_requests',
          filter: `room_number=eq.${userRoomNumber}`,
        }, (payload) => {
          console.log('Notification page - service request update received by room number:', payload);
          
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
              description: `Votre demande de type ${payload.new.type} pour la chambre ${userRoomNumber} ${message}.`
            });
          }
          
          refetchRequests();
        })
        .subscribe();
      
      channels.push(roomServiceChannel);
    }
    
    return () => {
      console.log("Cleaning up real-time listeners for notifications page");
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [userId, userEmail, userRoomNumber, refetchReservations, refetchRequests]);
};
