
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
    
    // Update only the status field and let database triggers handle updated_at
    const { error } = await supabase
      .from('event_reservations')
      .update({ 
        status: data.status,
        // Include updated_at explicitly since the trigger might be expecting it
        updated_at: new Date().toISOString()
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
