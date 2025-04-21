
import React from 'react';
import { useEventReservations } from '@/hooks/useEventReservations';
import { ReservationsGrid } from '@/pages/admin/components/events/ReservationsGrid';

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
    reservation => reservation.eventId && 
    reservation.event?.restaurant_id === restaurantId
  ) || [];

  const handleViewDetails = (reservation: any) => {
    // Implement view details functionality if needed
    console.log('View details:', reservation);
  };

  return (
    <ReservationsGrid
      reservations={filteredReservations}
      onViewDetails={handleViewDetails}
      onUpdateStatus={updateReservationStatus}
      isUpdating={isUpdating}
    />
  );
};

export default EventReservationsTab;
