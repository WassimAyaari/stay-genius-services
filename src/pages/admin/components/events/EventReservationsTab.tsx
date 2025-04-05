
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useEvents } from '@/hooks/useEvents';
import { useEventReservations } from '@/hooks/useEventReservations';
import { EventTable } from './EventTable';
import { ReservationsGrid } from './ReservationsGrid';
import { EventReservationDetail } from './EventReservationDetail';
import { UpdateEventReservationStatusDTO, EventReservation } from '@/types/event';
import { useStories } from '@/hooks/useStories';

export const EventReservationsTab: React.FC<{
  selectedEventId?: string;
  setSelectedEventId: (eventId: string | undefined) => void;
}> = ({ selectedEventId, setSelectedEventId }) => {
  const { events, loading: eventsLoading } = useEvents();
  const { stories } = useStories();
  const [selectedReservation, setSelectedReservation] = useState<EventReservation | undefined>(undefined);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const { 
    reservations, 
    isLoading: reservationsLoading, 
    updateReservationStatus,
    isUpdating
  } = useEventReservations(selectedEventId);
  
  // Reset selected reservation when event changes
  useEffect(() => {
    setSelectedReservation(undefined);
  }, [selectedEventId]);
  
  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setSelectedReservation(undefined);
  };
  
  const handleViewReservation = (reservation: EventReservation) => {
    setSelectedReservation(reservation);
    setIsDetailOpen(true);
  };
  
  const handleUpdateStatus = (reservationId: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    const update: UpdateEventReservationStatusDTO = {
      id: reservationId,
      status
    };
    updateReservationStatus(update);
  };
  
  if (eventsLoading) {
    return (
      <div className="p-8 text-center">
        Chargement des événements...
      </div>
    );
  }
  
  if (events.length === 0) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl mb-2">Aucun événement trouvé</h3>
        <p className="text-muted-foreground">
          Créez d'abord des événements dans l'onglet "Événements"
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 flex-1 h-full">
      {/* Left column - Events list */}
      <Card className="md:col-span-2 overflow-hidden flex flex-col h-full">
        <EventTable 
          events={events} 
          selectedEventId={selectedEventId} 
          onSelectEvent={handleSelectEvent} 
          stories={stories}
        />
      </Card>
      
      {/* Right column - Reservations for selected event */}
      <Card className="md:col-span-3 p-6 overflow-hidden flex flex-col h-full">
        {!selectedEventId ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-xl mb-2">Sélectionnez un événement</h3>
              <p className="text-muted-foreground">
                Choisissez un événement dans la liste pour voir ses réservations
              </p>
            </div>
          </div>
        ) : reservationsLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>Chargement des réservations...</p>
          </div>
        ) : (
          <ReservationsGrid 
            reservations={reservations} 
            onViewDetails={handleViewReservation}
            onUpdateStatus={handleUpdateStatus}
            isUpdating={isUpdating}
          />
        )}
      </Card>
      
      {/* Reservation Detail Dialog */}
      {selectedReservation && (
        <EventReservationDetail
          reservation={selectedReservation}
          onOpenChange={setIsDetailOpen}
          open={isDetailOpen}
          onUpdateStatus={handleUpdateStatus}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
};
