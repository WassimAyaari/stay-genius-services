
import React from 'react';
import { useEventReservations } from '@/hooks/useEventReservations';
import { ReservationsGrid } from '@/pages/admin/components/events/ReservationsGrid';
import { UpdateEventReservationStatusDTO } from '@/types/event';

interface EventReservationsTabProps {
  restaurantId: string;
}

const EventReservationsTab: React.FC<EventReservationsTabProps> = ({ restaurantId }) => {
  const { 
    reservations,
    isLoading,
    error,
    updateReservationStatus,
    isUpdating
  } = useEventReservations();

  // Filter reservations for events belonging to this restaurant
  const filteredReservations = reservations?.filter(
    reservation => {
      // Get the event ID from the reservation
      const eventId = reservation.eventId;
      
      // Find the event in the reservations array and check if it belongs to this restaurant
      return eventId && 
        // Use the backend API to verify restaurant_id matches
        reservation.event?.restaurant_id === restaurantId;
    }
  ) || [];

  const handleViewDetails = (reservation: any) => {
    // Implement view details functionality if needed
    console.log('View details:', reservation);
  };

  const handleUpdateStatus = (reservationId: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    const updateDto: UpdateEventReservationStatusDTO = {
      id: reservationId,
      status
    };
    updateReservationStatus(updateDto);
  };

  return (
    <ReservationsGrid
      reservations={filteredReservations}
      onViewDetails={handleViewDetails}
      onUpdateStatus={handleUpdateStatus}
      isUpdating={isUpdating}
    />
  );
};

export default EventReservationsTab;
