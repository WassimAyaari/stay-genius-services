
import React, { useState } from 'react';
import { useEventReservations } from '@/hooks/useEventReservations';
import { useEvents } from '@/hooks/useEvents';
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventReservation } from '@/types/event';
import { EventTable } from './EventTable';
import { ReservationsGrid } from './ReservationsGrid';
import { EventReservationDetail } from './EventReservationDetail';

interface EventReservationsTabProps {
  selectedEventId: string | undefined;
  setSelectedEventId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const EventReservationsTab: React.FC<EventReservationsTabProps> = ({ 
  selectedEventId, 
  setSelectedEventId 
}) => {
  const { events } = useEvents();
  const { 
    reservations, 
    isLoading, 
    updateReservationStatus, 
    isUpdating
  } = useEventReservations(selectedEventId);

  const [selectedReservation, setSelectedReservation] = useState<EventReservation | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  const handleViewDetails = (reservation: EventReservation) => {
    setSelectedReservation(reservation);
    setDetailDialogOpen(true);
  };

  const handleStatusUpdate = (reservationId: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    updateReservationStatus({ id: reservationId, status: newStatus });
  };

  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Réservations des événements</h2>
      
      <Card className="mb-6 overflow-hidden">
        <EventTable 
          events={events} 
          selectedEventId={selectedEventId} 
          onSelectEvent={handleSelectEvent} 
        />
      </Card>
      
      {/* Event Reservations Display */}
      <Card className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-medium">
            {selectedEventId ? `Réservations pour: ${events.find(e => e.id === selectedEventId)?.title || ""}` : "Sélectionnez un événement"}
          </h3>
        </div>
        {isLoading ? (
          <div className="p-6 text-center">Chargement des réservations...</div>
        ) : !selectedEventId ? (
          <div className="p-6 text-center">Veuillez sélectionner un événement pour voir ses réservations</div>
        ) : (
          <div className="p-4">
            <ReservationsGrid 
              reservations={reservations}
              onViewDetails={handleViewDetails}
              onUpdateStatus={handleStatusUpdate}
              isUpdating={isUpdating}
            />
          </div>
        )}
      </Card>
      
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Détails de la réservation</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <EventReservationDetail reservation={selectedReservation} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
