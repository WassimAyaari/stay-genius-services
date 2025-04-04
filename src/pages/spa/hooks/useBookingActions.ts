
import { useState } from 'react';
import { useSpaBookings } from '@/hooks/useSpaBookings';
import { toast } from 'sonner';
import { UseBookingDetailsProps } from './types/bookingDetailsTypes';

export const useBookingActions = ({ id }: UseBookingDetailsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { getBookingById, cancelBooking } = useSpaBookings();
  
  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };
  
  const handleCancelBooking = async () => {
    if (!id) return;
    
    try {
      await cancelBooking(id);
      const updatedBooking = await getBookingById(id);
      toast.success("Réservation annulée avec succès");
      return updatedBooking;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error("Erreur lors de l'annulation de la réservation");
      return null;
    }
  };
  
  return {
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleEdit,
    handleCancelBooking
  };
};
