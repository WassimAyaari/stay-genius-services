
import React, { useState, useEffect } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { useEventReservations } from '@/hooks/useEventReservations';
import { EventTable } from './EventTable';
import { EventReservationDetail } from './EventReservationDetail';
import { UpdateEventReservationStatusDTO, EventReservation } from '@/types/event';
import { useStories } from '@/hooks/useStories';
import { ReservationsGrid } from './ReservationsGrid';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

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
    isUpdating,
    error: reservationsError
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
    try {
      const update: UpdateEventReservationStatusDTO = {
        id: reservationId,
        status
      };
      
      updateReservationStatus(update);
      
      // Show success toast after a short delay to allow the update to complete
      setTimeout(() => {
        const statusLabel = status === 'confirmed' ? 'confirmed' : status === 'cancelled' ? 'cancelled' : 'pending';
        toast.success(`Reservation ${statusLabel} successfully`);
      }, 300);
      
    } catch (error) {
      console.error('Error in handleUpdateStatus:', error);
      toast.error("Error updating reservation status");
    }
  };
  
  if (eventsLoading) {
    return (
      <div className="p-8 text-center">
        Loading events...
      </div>
    );
  }
  
  if (events.length === 0) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl mb-2">No events found</h3>
        <p className="text-muted-foreground">
          Create events first in the "Events" tab
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
          <h2 className="text-xl font-semibold mb-4">Reservations for the event</h2>
          {reservationsLoading ? (
            <div className="text-center py-4">
              <p>Loading reservations...</p>
            </div>
          ) : reservationsError ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>Error loading reservations</p>
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
