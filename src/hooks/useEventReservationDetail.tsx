
import { useEventReservationDetailQuery } from './events/useEventReservationDetailQuery';
import { useEventReservationCancellation } from './events/useEventReservationCancellation';

/**
 * Main hook for working with event reservation details
 * Combines queries and cancellation functionality
 */
export const useEventReservationDetail = (reservationId: string) => {
  const { 
    reservation, 
    isLoading, 
    error,
    refetch 
  } = useEventReservationDetailQuery(reservationId);
  
  const { cancelReservation } = useEventReservationCancellation();
  
  // Wrap cancelReservation to automatically refetch after cancellation
  const handleCancelReservation = async () => {
    if (!reservationId) {
      console.error('No reservation ID provided for cancellation');
      throw new Error('ID de réservation manquant');
    }
    
    try {
      const result = await cancelReservation(reservationId);
      // Refetch pour mettre à jour l'UI après annulation
      await refetch();
      return result;
    } catch (error) {
      console.error('Error in handleCancelReservation:', error);
      throw error; // Propager l'erreur pour gestion dans le composant
    }
  };

  return {
    reservation,
    isLoading,
    error,
    refetch,
    cancelReservation: handleCancelReservation
  };
};
