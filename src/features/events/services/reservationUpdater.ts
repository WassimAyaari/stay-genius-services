
import { supabase } from '@/integrations/supabase/client';
import { UpdateEventReservationStatusDTO } from '@/types/event';

/**
 * Update event reservation status
 */
export const updateEventReservationStatus = async (data: UpdateEventReservationStatusDTO): Promise<void> => {
  try {
    // Remove any field that doesn't exist in the table
    const updateData = { status: data.status };
    
    const { error } = await supabase
      .from('event_reservations')
      .update(updateData)
      .eq('id', data.id);
    
    if (error) {
      console.error('Error updating event reservation status:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating event reservation status:', error);
    throw error;
  }
};
