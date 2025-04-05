
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useEvents } from '@/hooks/useEvents';
import { useEventReservations } from '@/hooks/useEventReservations';
import { EventReservation } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, XCircle, ClockIcon, BadgeCheck, Ban, ArrowUpDown, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EventReservationsManager: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Fetch events for the dropdown selector
  const { events, loading: eventsLoading } = useEvents();
  
  // Fetch reservations for the selected event
  const { 
    reservations, 
    isLoading, 
    updateReservationStatus, 
    isUpdating 
  } = useEventReservations(eventId || undefined);
  
  // Filter reservations by status if a filter is applied
  const filteredReservations = statusFilter
    ? reservations.filter(res => res.status === statusFilter)
    : reservations;

  const handleEventChange = (id: string) => {
    setSearchParams({ eventId: id });
  };

  const handleStatusChange = (reservationId: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    updateReservationStatus({ id: reservationId, status: newStatus });
    
    const statusMessages = {
      'confirmed': 'confirmée',
      'cancelled': 'annulée',
      'pending': 'mise en attente'
    };
    
    toast.success(`Réservation ${statusMessages[newStatus]}`, {
      description: `Le statut de la réservation a été mis à jour.`
    });
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'confirmed':
        return <BadgeCheck className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <Ban className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Confirmée';
      case 'cancelled': return 'Annulée';
      default: return 'En attente';
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  // Component for selecting an event when no event is selected
  const EventSelector = () => (
    <div className="space-y-6 py-12">
      <div className="text-center space-y-2">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Sélectionner un événement</h2>
        <p className="text-muted-foreground">Veuillez choisir un événement pour gérer ses réservations</p>
      </div>
      
      {eventsLoading ? (
        <div className="text-center py-4">Chargement des événements...</div>
      ) : events && events.length > 0 ? (
        <div className="max-w-md mx-auto">
          <Select onValueChange={handleEventChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un événement" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title} - {format(new Date(event.date), 'dd/MM/yyyy', {locale: fr})}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-muted-foreground">Aucun événement trouvé</p>
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="container py-8 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        <h1 className="text-2xl font-bold mb-6">Gestion des Réservations d'Événements</h1>
        
        {!eventId ? (
          <EventSelector />
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSearchParams({})}>
                  ← Changer d'événement
                </Button>
                <h2 className="text-xl font-semibold">
                  {events?.find(e => e.id === eventId)?.title || 'Chargement...'}
                </h2>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter || ''} onValueChange={(value) => setStatusFilter(value || null)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmées</SelectItem>
                    <SelectItem value="cancelled">Annulées</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Card className="flex-1 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>Liste des réservations</CardTitle>
                <CardDescription>
                  Gérez les réservations pour cet événement
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  {isLoading ? (
                    <div className="p-6 text-center">Chargement des réservations...</div>
                  ) : filteredReservations.length === 0 ? (
                    <div className="p-6 text-center">
                      {statusFilter 
                        ? `Aucune réservation avec le statut "${getStatusText(statusFilter)}" trouvée.`
                        : "Aucune réservation trouvée pour cet événement."}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invité</TableHead>
                          <TableHead>Chambre</TableHead>
                          <TableHead>Personnes</TableHead>
                          <TableHead>Date de réservation</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReservations.map((reservation) => (
                          <TableRow key={reservation.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-4 w-4 text-gray-500" />
                                </div>
                                <div>
                                  <div className="font-medium">{reservation.guestName || 'Non spécifié'}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{reservation.roomNumber || '-'}</TableCell>
                            <TableCell>{reservation.guests}</TableCell>
                            <TableCell>{format(new Date(reservation.createdAt), 'dd/MM/yyyy HH:mm', {locale: fr})}</TableCell>
                            <TableCell>
                              <div>
                                {reservation.guestEmail ? (
                                  <div className="text-xs text-blue-600">{reservation.guestEmail}</div>
                                ) : null}
                                {reservation.guestPhone ? (
                                  <div className="text-xs">{reservation.guestPhone}</div>
                                ) : null}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusClass(reservation.status)}`}>
                                {getStatusIcon(reservation.status)}
                                {getStatusText(reservation.status)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {reservation.status !== 'confirmed' && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="h-8">
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Confirmer
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Confirmer cette réservation ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Cette action notifiera l'invité que sa réservation est confirmée.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          Confirmer
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                                
                                {reservation.status !== 'cancelled' && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="h-8">
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Annuler
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Annuler cette réservation ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Cette action notifiera l'invité que sa réservation est annulée.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Retour</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Annuler la réservation
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                                
                                {reservation.status !== 'pending' && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="h-8">
                                        <ClockIcon className="h-4 w-4 mr-1" />
                                        En attente
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Remettre en attente ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Cette action changera le statut de cette réservation à "En attente".
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => handleStatusChange(reservation.id, 'pending')}
                                          className="bg-yellow-600 hover:bg-yellow-700"
                                        >
                                          Mettre en attente
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventReservationsManager;
