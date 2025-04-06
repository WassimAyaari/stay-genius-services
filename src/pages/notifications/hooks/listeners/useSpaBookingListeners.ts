
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Sets up a real-time listener for spa bookings by user ID
 */
export const setupSpaBookingListenerById = (
  userId: string, 
  refetchSpaBookings: () => void
) => {
  console.log("Setting up spa booking listener by user ID:", userId);
  
  return supabase
    .channel('spa_booking_updates_by_id')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'spa_bookings',
      filter: `user_id=eq.${userId}`,
    }, (payload) => {
      console.log('Spa booking update received by user ID:', payload);
      
      // Notify the user about the status change
      if (payload.eventType === 'UPDATE' && payload.new && payload.old && 
          payload.new.status !== payload.old.status) {
        notifySpaBookingStatusChange(payload.new.status);
      }
      
      refetchSpaBookings();
    })
    .subscribe();
};

/**
 * Sets up a real-time listener for spa bookings by room number
 */
export const setupSpaBookingListenerByRoom = (
  roomNumber: string, 
  refetchSpaBookings: () => void
) => {
  console.log("Setting up spa booking listener by room number:", roomNumber);
  
  return supabase
    .channel('spa_booking_updates_by_room')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'spa_bookings',
      filter: `room_number=eq.${roomNumber}`,
    }, (payload) => {
      console.log('Spa booking update received by room number:', payload);
      
      // Notify the user about the status change
      if (payload.eventType === 'UPDATE' && payload.new && payload.old && 
          payload.new.status !== payload.old.status) {
        notifySpaBookingStatusChange(payload.new.status);
      }
      
      refetchSpaBookings();
    })
    .subscribe();
};

/**
 * Displays a notification for spa booking status changes
 */
const notifySpaBookingStatusChange = (status: string) => {
  const statusMessages: Record<string, string> = {
    'pending': 'est en attente de confirmation',
    'confirmed': 'a été confirmée',
    'cancelled': 'a été annulée',
    'completed': 'a été complétée'
  };
  
  const message = statusMessages[status] || 'a été mise à jour';
  
  toast.info('Mise à jour de demande de réservation spa', {
    description: `Votre demande de réservation de spa ${message}.`
  });
};
