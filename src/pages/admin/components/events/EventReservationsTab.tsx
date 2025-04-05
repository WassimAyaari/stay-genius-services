
import React, { useState, useEffect } from 'react';
import { useEventReservations } from '@/hooks/useEventReservations';
import { useEvents } from '@/hooks/useEvents';
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventReservation } from '@/types/event';
import { EventTable } from './EventTable';
import { ReservationsGrid } from './ReservationsGrid';
import { EventReservationDetail } from './EventReservationDetail';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
    isUpdating,
    refetch
  } = useEventReservations(selectedEventId);

  const [selectedReservation, setSelectedReservation] = useState<EventReservation | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [reservationView, setReservationView] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  
  // Refetch when tab changes
  useEffect(() => {
    if (selectedEventId) {
      refetch();
    }
  }, [selectedEventId, refetch]);
  
  const filteredReservations = reservations.filter(reservation => {
    if (reservationView === 'all') return true;
    return reservation.status === reservationView;
  });
  
  const reservationStats = {
    all: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length
  };

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

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Réservations des événements</h2>
      
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left column: Events list */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <EventTable 
              events={events} 
              selectedEventId={selectedEventId} 
              onSelectEvent={handleSelectEvent} 
            />
          </Card>
        </div>
        
        {/* Right column: Reservations */}
        <div className="lg:col-span-3">
          <Card className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <div className="flex flex-col space-y-2">
                <h3 className="font-medium">
                  {selectedEventId 
                    ? `Réservations pour: ${selectedEvent?.title || ""}` 
                    : "Sélectionnez un événement"}
                </h3>
                
                {selectedEvent && (
                  <div className="text-sm text-muted-foreground">
                    <span>Date: {format(new Date(selectedEvent.date), 'dd MMMM yyyy', { locale: fr })}</span>
                    {selectedEvent.time && (
                      <span> à {selectedEvent.time}</span>
                    )}
                    {selectedEvent.location && (
                      <span> | Lieu: {selectedEvent.location}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {isLoading ? (
              <div className="p-6 text-center">Chargement des réservations...</div>
            ) : !selectedEventId ? (
              <div className="p-6 text-center">Veuillez sélectionner un événement pour voir ses réservations</div>
            ) : (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="border-b">
                  <Tabs defaultValue="all" className="w-full">
                    <div className="px-4">
                      <TabsList className="grid grid-cols-4 mb-0">
                        <TabsTrigger value="all" onClick={() => setReservationView('all')}>
                          Toutes ({reservationStats.all})
                        </TabsTrigger>
                        <TabsTrigger value="pending" onClick={() => setReservationView('pending')}>
                          En attente ({reservationStats.pending})
                        </TabsTrigger>
                        <TabsTrigger value="confirmed" onClick={() => setReservationView('confirmed')}>
                          Confirmées ({reservationStats.confirmed})
                        </TabsTrigger>
                        <TabsTrigger value="cancelled" onClick={() => setReservationView('cancelled')}>
                          Annulées ({reservationStats.cancelled})
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  </Tabs>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  <ReservationsGrid 
                    reservations={filteredReservations}
                    onViewDetails={handleViewDetails}
                    onUpdateStatus={handleStatusUpdate}
                    isUpdating={isUpdating}
                  />
                </ScrollArea>
              </div>
            )}
          </Card>
        </div>
      </div>
      
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
