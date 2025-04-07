
import { useEventReservationQueries } from './useEventReservationQueries';
import { useEventReservationMutations } from './useEventReservationMutations';
import { useEventReservationRealtime } from './useEventReservationRealtime';

/**
 * Main hook for working with event reservations
 * Combines queries, mutations, and real-time updates
 */
export const useEventReservations = (eventId?: string) => {
  const { 
    reservations,
    isLoading,
    error,
    refetch,
    queryClient,
    userId,
    userEmail,
    isEventSpecific
  } = useEventReservationQueries(eventId);
  
  const {
    cancelReservation,
    isCancelling,
    createReservation,
    isCreating,
    updateReservationStatus,
    isUpdating
  } = useEventReservationMutations(userId, userEmail, eventId);
  
  // Setup real-time listeners
  useEventReservationRealtime(queryClient, userId, userEmail, eventId, isEventSpecific);

  return {
    reservations,
    isLoading,
    error,
    refetch,
    cancelReservation,
    isCancelling,
    createReservation,
    isCreating,
    updateReservationStatus,
    isUpdating
  };
};
