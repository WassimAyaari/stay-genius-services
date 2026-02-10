
import { supabase } from '@/integrations/supabase/client';

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
      refetchSpaBookings();
    })
    .subscribe();
};
