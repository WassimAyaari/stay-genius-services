
import React, { useState, useEffect } from 'react';
import { useEventReservations } from '@/hooks/useEventReservations';
import { useEvents } from '@/hooks/useEvents';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Event, EventReservation } from '@/types/event';
import { Check, X, Eye, Phone, Calendar } from 'lucide-react';
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
  
  const limitedEvents = events.slice(0, 5);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'cancelled': return 'Annulée';
      case 'pending': return 'En attente';
      default: return status;
    }
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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Réservations des événements</h2>
      
      <Card className="mb-6 overflow-hidden">
        <ScrollArea className="h-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Événement</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {limitedEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Aucun événement disponible
                  </TableCell>
                </TableRow>
              ) : (
                limitedEvents.map((event: Event) => (
                  <TableRow key={event.id} className={selectedEventId === event.id ? "bg-muted" : ""}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{format(new Date(event.date), 'dd MMM yyyy', { locale: fr })}</TableCell>
                    <TableCell>{event.category === 'event' ? 'Événement' : 'Promotion'}</TableCell>
                    <TableCell>
                      <Button 
                        variant={selectedEventId === event.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSelectEvent(event.id)}
                        className="flex items-center gap-1"
                      >
                        <Calendar className="h-4 w-4" />
                        {selectedEventId === event.id ? 'Sélectionné' : 'Voir réservations'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
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
            {reservations.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Aucune réservation trouvée pour cet événement</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reservations.map((reservation) => (
                  <Card key={reservation.id} className="overflow-hidden">
                    <div className={`h-2 w-full ${getStatusBadgeClass(reservation.status)}`} />
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold">{reservation.guestName}</h3>
                        <Badge className={getStatusBadgeClass(reservation.status)}>
                          {getStatusLabel(reservation.status)}
                        </Badge>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 opacity-70" />
                          <span>{format(new Date(reservation.date), 'dd MMMM yyyy', { locale: fr })}</span>
                        </div>
                        
                        {reservation.guestPhone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2 opacity-70" />
                            <span>{reservation.guestPhone}</span>
                          </div>
                        )}
                        
                        <div className="text-sm flex items-center">
                          <span className="font-medium mr-2">Chambre:</span> {reservation.roomNumber}
                        </div>
                        
                        <div className="text-sm flex items-center">
                          <span className="font-medium mr-2">Participants:</span> {reservation.guests}
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4 pt-4 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleViewDetails(reservation)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        
                        {reservation.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1 border-green-500 text-green-500 hover:bg-green-50"
                              onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                              disabled={isUpdating}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Confirmer
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                              onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                              disabled={isUpdating}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Refuser
                            </Button>
                          </>
                        )}
                        
                        {reservation.status === 'confirmed' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Annuler
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Annuler la réservation</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Confirmer l'annulation
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
