
import { supabase } from '@/integrations/supabase/client';
import { UpdateEventReservationStatusDTO } from '@/types/event';

/**
 * Update event reservation status
 */
export const updateEventReservationStatus = async (data: UpdateEventReservationStatusDTO): Promise<void> => {
  try {
    console.log('Updating event reservation status:', data);
    
    // Add a timestamp explicitly to avoid the error with updated_at
    const { error } = await supabase
      .from('event_reservations')
      .update({ 
        status: data.status,
        // We can't use NOW() here as it's not allowed in RPC calls
        // Using new Date() instead which will be converted to ISO string by Supabase
      })
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
