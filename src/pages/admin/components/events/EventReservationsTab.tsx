
import React, { useState } from 'react';
import { useEventReservations } from '@/hooks/useEventReservations';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EventReservationForm from '@/components/events/EventReservationForm';
import { EventReservation } from '@/types/event';
import { Check, X, Eye, Phone } from 'lucide-react';
import { EventReservationDetail } from './EventReservationDetail';

interface EventReservationsTabProps {
  selectedEventId: string | undefined;
  setSelectedEventId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const EventReservationsTab: React.FC<EventReservationsTabProps> = ({ 
  selectedEventId, 
  setSelectedEventId 
}) => {
  const { 
    reservations, 
    isLoading, 
    updateReservationStatus, 
    isUpdating
  } = useEventReservations(selectedEventId);

  const [selectedReservation, setSelectedReservation] = useState<EventReservation | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Fonction pour obtenir la classe de la badge en fonction du statut
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  // Fonction pour obtenir le libellé en français du statut
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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Réservations des événements</h2>
      
      <Card className="mb-6 flex-1 overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="p-6 text-center">Chargement des réservations...</div>
        ) : (
          <ScrollArea className="h-[calc(100vh-300px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Chambre</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Aucune réservation trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>{reservation.guestName}</TableCell>
                      <TableCell>{reservation.roomNumber}</TableCell>
                      <TableCell>
                        {reservation.guestPhone ? (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{reservation.guestPhone}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(reservation.date), 'dd MMM yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell className="text-center">{reservation.guests}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(reservation.status)}>
                          {getStatusLabel(reservation.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewDetails(reservation)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {reservation.status === 'pending' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-green-600"
                                onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                                disabled={isUpdating}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-red-600"
                                onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                                disabled={isUpdating}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {reservation.status === 'confirmed' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-red-600"
                                >
                                  <X className="h-4 w-4" />
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </Card>
      
      {/* Dialogue pour afficher les détails d'une réservation */}
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
