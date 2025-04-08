
import { supabase } from '@/integrations/supabase/client';
import { UpdateEventReservationStatusDTO, EventReservation } from '@/types/event';
import { mapRowToEventReservation } from './mappers/eventReservationMapper';
import { EventReservationRow } from '../types/eventReservation';

/**
 * Update the status of an event reservation
 */
export const updateEventReservationStatus = async (update: UpdateEventReservationStatusDTO): Promise<EventReservation> => {
  console.log('Updating event reservation status:', update);
  
  if (!update.id) {
    throw new Error('ID de réservation invalide');
  }
  
  if (!update.status) {
    throw new Error('Statut invalide');
  }
  
  try {
    const { data, error } = await supabase
      .from('event_reservations')
      .update({ status: update.status })
      .eq('id', update.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating event reservation status:', error);
      throw new Error(error.message || 'Erreur lors de la mise à jour de la réservation');
    }

    if (!data) {
      throw new Error('Aucune donnée retournée lors de la mise à jour de la réservation');
    }

    // Cast the returned data to our expected structure
    const result = data as unknown as EventReservationRow;
    
    return mapRowToEventReservation(result);
  } catch (error: any) {
    console.error('Error updating event reservation status:', error);
    throw error;
  }
};
