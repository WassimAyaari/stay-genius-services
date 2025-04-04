
import { SpaBooking, SpaService, SpaFacility } from '@/features/spa/types';

export interface UseBookingDetailsProps {
  id: string | undefined;
}

export interface BookingDetailsState {
  booking: SpaBooking | null;
  service: SpaService | null;
  facility: SpaFacility | null;
  isLoading: boolean;
  userId: string | null;
  error: string | null;
}
