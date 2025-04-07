
import React from 'react';
import { EventReservation } from '@/types/event';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Check, X, Eye, Phone, Calendar, User, Home, Mail } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ReservationCardProps {
  reservation: EventReservation;
  onViewDetails: (reservation: EventReservation) => void;
  onUpdateStatus: (reservationId: string, status: 'pending' | 'confirmed' | 'cancelled') => void;
  isUpdating: boolean;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onViewDetails,
  onUpdateStatus,
  isUpdating
}) => {
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

  const handleUpdateStatus = (status: 'pending' | 'confirmed' | 'cancelled') => {
    console.log('ReservationCard: updating status to', status);
    onUpdateStatus(reservation.id, status);
  };

  return (
    <Card className="overflow-hidden">
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
          
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 opacity-70" />
            <span>{reservation.guests} {reservation.guests > 1 ? 'participants' : 'participant'}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Home className="h-4 w-4 mr-2 opacity-70" />
            <span>Chambre: {reservation.roomNumber || '-'}</span>
          </div>
          
          {reservation.guestEmail && (
            <div className="flex items-center text-sm overflow-hidden">
              <Mail className="h-4 w-4 mr-2 flex-shrink-0 opacity-70" />
              <span className="truncate">{reservation.guestEmail}</span>
            </div>
          )}
          
          {reservation.guestPhone && (
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 opacity-70" />
              <span>{reservation.guestPhone}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-2 mt-4 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails(reservation)}
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
                onClick={() => handleUpdateStatus('confirmed')}
                disabled={isUpdating}
              >
                <Check className="h-4 w-4 mr-1" />
                Confirmer
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => handleUpdateStatus('cancelled')}
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
                  disabled={isUpdating}
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
                    onClick={() => handleUpdateStatus('cancelled')}
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
  );
};
