
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { updateEventReservationStatus } from '@/features/events/services/reservationUpdater';
import { UpdateEventReservationStatusDTO } from '@/types/event';

/**
 * Hook for cancelling event reservations
 */
export const useEventReservationCancellation = () => {
  /**
   * Cancels an event reservation by setting its status to 'cancelled'
   * @param reservationId The ID of the reservation to cancel
   */
  const cancelReservation = async (reservationId: string) => {
    try {
      if (!reservationId) {
        const error = new Error('No reservation to cancel');
        toast.error('Erreur: ID de réservation manquant');
        throw error;
      }
      
      console.log(`Attempting to cancel reservation with ID: ${reservationId}`);
      
      // Use the dedicated service to update the status
      const updateDTO: UpdateEventReservationStatusDTO = {
        id: reservationId,
        status: 'cancelled'
      };
      
      await updateEventReservationStatus(updateDTO);
      
      toast.success('Réservation annulée avec succès');
      return true;
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast.error('Erreur lors de l\'annulation de la réservation');
      throw error;
    }
  };

  return {
    cancelReservation
  };
};
