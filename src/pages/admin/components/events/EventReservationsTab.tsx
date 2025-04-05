
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useEvents } from '@/hooks/useEvents';
import { useEventReservations } from '@/hooks/useEventReservations';
import { EventTable } from './EventTable';
import { ReservationsGrid } from './ReservationsGrid';
import { EventReservationDetail } from './EventReservationDetail';
import { UpdateEventReservationStatusDTO, EventReservation } from '@/types/event';
import { useStories } from '@/hooks/useStories';
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EventReservationsTab: React.FC<{
  selectedEventId?: string;
  setSelectedEventId: (eventId: string | undefined) => void;
}> = ({ selectedEventId, setSelectedEventId }) => {
  const { events, loading: eventsLoading } = useEvents();
  const { stories } = useStories();
  const [selectedReservation, setSelectedReservation] = useState<EventReservation | undefined>(undefined);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
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
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  if (eventsLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse bg-slate-200 h-8 w-64 mx-auto rounded-md mb-4"></div>
        <div className="animate-pulse bg-slate-200 h-4 w-48 mx-auto rounded-md"></div>
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
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row gap-8 flex-1 h-full">
        {/* Left column - Events list */}
        <Card className={`overflow-hidden flex flex-col ${isCollapsed ? 'md:w-16' : 'md:w-1/3'} transition-all duration-300 ease-in-out`}>
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className={`font-medium ${isCollapsed ? 'hidden' : 'block'}`}>Événements disponibles</h3>
            <Button variant="ghost" size="icon" onClick={toggleCollapse} className="ml-auto">
              {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          </div>
          <EventTable 
            events={events} 
            selectedEventId={selectedEventId} 
            onSelectEvent={handleSelectEvent} 
            stories={stories}
            isCollapsed={isCollapsed}
          />
        </Card>
        
        {/* Right column - Reservations for selected event */}
        <Card className={`p-6 overflow-hidden flex flex-col ${isCollapsed ? 'md:flex-1' : 'md:w-2/3'} transition-all duration-300 ease-in-out`}>
          {!selectedEventId ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <h3 className="text-xl mb-4">Sélectionnez un événement</h3>
                <p className="text-muted-foreground">
                  Choisissez un événement dans la liste pour voir ses réservations.
                </p>
                <p className="text-muted-foreground mt-2">
                  Vous pourrez ensuite gérer les réservations, les confirmer ou les annuler.
                </p>
                <Separator className="my-6" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-700">1. Sélectionner</p>
                    <p className="text-xs text-muted-foreground mt-1">Choisir un événement</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-700">2. Visualiser</p>
                    <p className="text-xs text-muted-foreground mt-1">Voir les réservations</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-700">3. Gérer</p>
                    <p className="text-xs text-muted-foreground mt-1">Confirmer ou annuler</p>
                  </div>
                </div>
              </div>
            </div>
          ) : reservationsLoading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
      </div>
      
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
