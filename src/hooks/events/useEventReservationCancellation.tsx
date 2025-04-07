
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      if (!reservationId) throw new Error('No reservation to cancel');
      
      // Update the reservation status to 'cancelled'
      const { error } = await supabase
        .from('event_reservations')
        .update({ status: 'cancelled' })
        .eq('id', reservationId);
        
      if (error) {
        console.error('Error cancelling reservation:', error);
        throw error;
      }
      
      toast.success('Réservation annulée avec succès');
      return true;
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast.error('Erreur lors de l\'annulation de la réservation');
      throw error; // Rethrow to handle in the component
    }
  };

  return {
    cancelReservation
  };
};
