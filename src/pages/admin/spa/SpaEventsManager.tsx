
import React, { useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { useSpaFacilities } from '@/hooks/useSpaFacilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Event } from '@/types/event';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Calendar, Users } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useEventReservations } from '@/hooks/useEventReservations';
import { EventReservationDetail } from '@/pages/admin/components/events/EventReservationDetail';
import { EventReservation } from '@/types/event';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SpaEventsDialog from './SpaEventsDialog';

const SpaEventsManager = () => {
  const { events, loading, deleteEvent } = useEvents();
  const { facilities } = useSpaFacilities();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const { reservations, isLoading: reservationsLoading, updateReservationStatus } = useEventReservations(selectedEventId);
  const [selectedReservation, setSelectedReservation] = useState<EventReservation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Filter events by spa facility
  const spaEvents = events?.filter(event => event.spa_facility_id) || [];

  const handleEditEvent = (event: Event) => {
    const facility = facilities?.find(f => f.id === event.spa_facility_id);
    if (facility) {
      setSelectedFacility(facility);
      setSelectedEvent(event);
      setIsEventDialogOpen(true);
    }
  };

  const handleDeleteEvent = (event: Event) => {
    deleteEvent(event.id);
  };

  const handleViewReservations = (event: Event) => {
    setSelectedEventId(event.id);
    setSelectedEvent(event);
  };

  const handleViewReservation = (reservation: EventReservation) => {
    setSelectedReservation(reservation);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = (reservationId: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    updateReservationStatus({ id: reservationId, status });
  };

  const getFacilityName = (facilityId: string) => {
    const facility = facilities?.find(f => f.id === facilityId);
    return facility ? facility.name : 'Non spécifié';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Liste des événements</TabsTrigger>
          {selectedEvent && (
            <TabsTrigger value="reservations">Réservations</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Événements du Spa</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Chargement des événements...</div>
              ) : spaEvents.length === 0 ? (
                <div className="text-center py-4">Aucun événement trouvé pour le spa</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Installation</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Réservations</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {spaEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{getFacilityName(event.spa_facility_id!)}</TableCell>
                        <TableCell>
                          {format(new Date(event.date), 'dd/MM/yyyy')}
                          {event.time && ` à ${event.time}`}
                        </TableCell>
                        <TableCell>
                          {event.is_featured ? (
                            <Badge variant="secondary">Mis en avant</Badge>
                          ) : (
                            <Badge variant="outline">Standard</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewReservations(event)}
                            className="flex items-center gap-1"
                          >
                            <Calendar className="h-4 w-4" />
                            <span>Voir</span>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditEvent(event)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Modifier</span>
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-600">
                                  <Trash className="h-4 w-4" />
                                  <span className="sr-only">Supprimer</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer l'événement</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer cet événement ? Cette action ne peut pas être annulée.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteEvent(event)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservations">
          {selectedEvent && (
            <Card>
              <CardHeader>
                <CardTitle>Réservations pour: {selectedEvent.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {reservationsLoading ? (
                  <div className="text-center py-4">Chargement des réservations...</div>
                ) : reservations.length === 0 ? (
                  <div className="text-center py-4">Aucune réservation trouvée pour cet événement</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invité</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Chambre</TableHead>
                        <TableHead>Nombre d'invités</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell className="font-medium">{reservation.guestName || 'N/A'}</TableCell>
                          <TableCell>{reservation.guestEmail || 'N/A'}</TableCell>
                          <TableCell>{reservation.roomNumber || 'N/A'}</TableCell>
                          <TableCell>{reservation.guests}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                reservation.status === 'confirmed' ? 'default' :
                                reservation.status === 'cancelled' ? 'destructive' : 'outline'
                              }
                            >
                              {reservation.status === 'confirmed' ? 'Confirmé' :
                              reservation.status === 'cancelled' ? 'Annulé' : 'En attente'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewReservation(reservation)}
                              >
                                <Users className="h-4 w-4" />
                                <span className="sr-only">Détails</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {selectedFacility && (
        <SpaEventsDialog
          open={isEventDialogOpen}
          onOpenChange={setIsEventDialogOpen}
          facility={selectedFacility}
          event={selectedEvent}
        />
      )}

      {/* Reservation Detail Dialog */}
      {selectedReservation && (
        <EventReservationDetail
          reservation={selectedReservation}
          onOpenChange={setIsDetailOpen}
          open={isDetailOpen}
          onUpdateStatus={handleUpdateStatus}
          isUpdating={false}
        />
      )}
    </div>
  );
};

export default SpaEventsManager;
