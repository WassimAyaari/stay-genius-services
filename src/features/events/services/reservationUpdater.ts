
import { supabase } from '@/integrations/supabase/client';
import { UpdateEventReservationStatusDTO } from '@/types/event';

/**
 * Update event reservation status
 * Inspired by the restaurant reservation update approach
 */
export const updateEventReservationStatus = async (data: UpdateEventReservationStatusDTO): Promise<void> => {
  try {
    console.log('Updating event reservation status:', data);
    
    // Execute direct SQL update to avoid "updated_at" trigger issues
    // This is similar to how restaurant reservations are updated
    const { error } = await supabase.rpc(
      'update_event_reservation_status',
      { 
        reservation_id: data.id,
        new_status: data.status
      }
    );
    
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
