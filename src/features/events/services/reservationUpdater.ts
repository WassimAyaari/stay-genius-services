
import { supabase } from '@/integrations/supabase/client';
import { UpdateEventReservationStatusDTO } from '@/types/event';

/**
 * Update event reservation status
 * Using direct update to avoid updated_at trigger issues
 */
export const updateEventReservationStatus = async (data: UpdateEventReservationStatusDTO): Promise<void> => {
  try {
    console.log('Updating event reservation status:', data);
    
    // Using direct SQL update instead of RPC function to avoid issues
    const { error } = await supabase
      .from('event_reservations')
      .update({ status: data.status })
      .eq('id', data.id);
    
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
