
import { supabase } from '@/integrations/supabase/client';
import { UpdateEventReservationStatusDTO } from '@/types/event';

/**
 * Update event reservation status
 * Using the same approach as table reservations service
 * Let the database trigger handle updated_at
 */
export const updateEventReservationStatus = async (data: UpdateEventReservationStatusDTO): Promise<void> => {
  try {
    console.log('Updating event reservation status:', data);
    
    // Utiliser la fonction RPC dédiée pour éviter les problèmes avec updated_at
    const { error } = await supabase.rpc('update_event_reservation_status', {
      reservation_id: data.id,
      new_status: data.status
    });
    
    if (error) {
      console.error('Error updating event reservation status:', error);
      throw error;
    }
    
    console.log('Event reservation status updated successfully');
  } catch (error) {
    console.error('Error updating event reservation status:', error);
    throw error;
  }
};
