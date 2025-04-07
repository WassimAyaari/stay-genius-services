
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
    try {
      await cancelReservation(reservationId);
      refetch();
    } catch (error) {
      // Error is already handled in the cancelReservation function
      // Just re-throw it here so the component can handle it if needed
      throw error;
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
