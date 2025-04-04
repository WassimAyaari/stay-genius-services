
import { useState, useEffect } from 'react';
import { useBookingLoader } from './useBookingLoader';
import { useBookingActions } from './useBookingActions';
import { SpaBooking } from '@/features/spa/types';
import { UseBookingDetailsProps } from './types/bookingDetailsTypes';

export const useBookingDetails = (props: UseBookingDetailsProps) => {
  const state = useBookingLoader(props);
  const actions = useBookingActions(props);
  
  // Combine data from loader with updated booking if action changes it
  const [bookingState, setBookingState] = useState<SpaBooking | null>(null);
  
  useEffect(() => {
    if (state.booking) {
      setBookingState(state.booking);
    }
  }, [state.booking]);
  
  // Override original handleCancelBooking to update local state
  const handleCancelBooking = async () => {
    const updatedBooking = await actions.handleCancelBooking();
    if (updatedBooking) {
      setBookingState(updatedBooking);
    }
  };
  
  // Determine if booking can be edited or cancelled
  const canCancel = bookingState?.status === 'pending' || bookingState?.status === 'confirmed';
  const canEdit = bookingState?.status === 'pending';
  
  return {
    ...state,
    booking: bookingState,
    isEditDialogOpen: actions.isEditDialogOpen,
    setIsEditDialogOpen: actions.setIsEditDialogOpen,
    canCancel,
    canEdit,
    handleEdit: actions.handleEdit,
    handleCancelBooking
  };
};
