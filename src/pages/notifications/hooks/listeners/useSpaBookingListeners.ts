
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Set up listener for spa booking updates by user ID
 */
export const setupSpaBookingListenerById = (userId: string, refetchSpaBookings: () => void) => {
  return supabase
    .channel('notifications_page_spa_updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'spa_bookings',
      filter: `user_id=eq.${userId}`,
    }, (payload) => {
      console.log('Notification page - spa booking update received by user ID:', payload);
      handleSpaBookingUpdate(payload, refetchSpaBookings);
    })
    .subscribe();
};

/**
 * Set up listener for spa booking updates by room number
 */
export const setupSpaBookingListenerByRoom = (roomNumber: string, refetchSpaBookings: () => void) => {
  return supabase
    .channel('notifications_page_room_spa_updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'spa_bookings',
      filter: `room_number=eq.${roomNumber}`,
    }, (payload) => {
      console.log('Notification page - spa update received by room number:', payload);
      handleSpaBookingUpdate(payload, refetchSpaBookings);
    })
    .subscribe();
};

/**
 * Handle spa booking update events
 */
export const handleSpaBookingUpdate = (payload: any, refetchSpaBookings: () => void) => {
  // Show notification for status changes
  if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
    const statusMap: Record<string, string> = {
      'pending': 'est en attente',
      'confirmed': 'a été confirmée',
      'cancelled': 'a été annulée',
      'completed': 'a été complétée'
    };
    
    const status = payload.new.status;
    const message = statusMap[status] || 'a été mise à jour';
    
    const date = new Date(payload.new.date).toLocaleDateString('fr-FR');
    
    toast.info(`Mise à jour de réservation spa`, {
      description: `Votre réservation spa pour le ${date} à ${payload.new.time} ${message}.`
    });
  }
  
  refetchSpaBookings();
};
