
import React, { useState, useEffect } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { useEventReservations } from '@/hooks/useEventReservations';
import { EventTable } from './EventTable';
import { EventReservationDetail } from './EventReservationDetail';
import { UpdateEventReservationStatusDTO, EventReservation } from '@/types/event';
import { useStories } from '@/hooks/useStories';
import { ReservationsGrid } from './ReservationsGrid';
import { Card } from '@/components/ui/card';

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
    <div className="space-y-6">
      <EventTable 
        events={events} 
        selectedEventId={selectedEventId} 
        onSelectEvent={handleSelectEvent} 
        stories={stories}
      />
      
      {selectedEventId && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Réservations pour l'événement</h2>
          {reservationsLoading ? (
            <div className="text-center py-4">
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
      )}
      
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
