
import { useSpaBookingsFetching, ExtendedSpaBooking } from './spa/useSpaBookingsFetching';
import { useSpaBookingMutations } from './spa/useSpaBookingMutations';
import { SpaBooking } from '@/features/spa/types';

export const useSpaBookings = () => {
  const {
    bookings,
    isLoading,
    error,
    getBookingById,
    fetchUserBookings,
    refetch
  } = useSpaBookingsFetching();

  const {
    createBooking,
    updateBookingStatus,
    cancelBooking,
    isCreating,
    isUpdating,
    isCancelling
  } = useSpaBookingMutations();

  return {
    bookings,
    isLoading,
    error,
    getBookingById,
    fetchUserBookings,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    isCreating,
    isUpdating,
    isCancelling,
    refetch
  };
};

// Re-export the ExtendedSpaBooking type for convenience
export type { ExtendedSpaBooking };
