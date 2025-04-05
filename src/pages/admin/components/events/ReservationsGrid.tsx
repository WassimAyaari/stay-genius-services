
import React from 'react';
import { EventReservation } from '@/types/event';
import { ReservationCard } from './ReservationCard';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReservationsGridProps {
  reservations: EventReservation[];
  onViewDetails: (reservation: EventReservation) => void;
  onUpdateStatus: (reservationId: string, status: 'pending' | 'confirmed' | 'cancelled') => void;
  isUpdating: boolean;
}

export const ReservationsGrid: React.FC<ReservationsGridProps> = ({
  reservations,
  onViewDetails,
  onUpdateStatus,
  isUpdating
}) => {
  if (reservations.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">Aucune réservation trouvée pour cet événement</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {reservations.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          onViewDetails={onViewDetails}
          onUpdateStatus={onUpdateStatus}
          isUpdating={isUpdating}
        />
      ))}
    </div>
  );
};
