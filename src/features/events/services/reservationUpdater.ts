
import { supabase } from '@/integrations/supabase/client';
import { UpdateEventReservationStatusDTO } from '@/types/event';

/**
 * Update event reservation status
 */
export const updateEventReservationStatus = async (data: UpdateEventReservationStatusDTO): Promise<void> => {
  try {
    // Correction : suppression de toute référence à updated_at qui cause l'erreur
    const { error } = await supabase
      .from('event_reservations')
      .update({ status: data.status })
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
