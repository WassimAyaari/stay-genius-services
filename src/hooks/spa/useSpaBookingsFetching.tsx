
import { useBookingsFetch } from './booking/useBookingsFetch';
import { fetchUserBookings } from './booking/useUserBookingsFetch';
import { getBookingById } from './booking/useBookingById';
import { ExtendedSpaBooking } from './booking/types';

export type { ExtendedSpaBooking };

export const useSpaBookingsFetching = () => {
  const { bookings, isLoading, error, refetch } = useBookingsFetch();

  return {
    bookings,
    isLoading,
    error,
    getBookingById,
    fetchUserBookings,
    refetch
  };
};
