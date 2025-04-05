
import React from 'react';
import { EventReservation } from '@/types/event';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Home, Calendar, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EventReservationDetailProps {
  reservation: EventReservation;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  onUpdateStatus?: (reservationId: string, status: 'pending' | 'confirmed' | 'cancelled') => void;
  isUpdating?: boolean;
}

export const EventReservationDetail: React.FC<EventReservationDetailProps> = ({ 
  reservation, 
  onOpenChange, 
  open = false,
  onUpdateStatus,
  isUpdating = false
}) => {
  // Fonction pour obtenir le libellé et la couleur du statut
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmée', className: 'bg-green-500' };
      case 'cancelled':
        return { label: 'Annulée', className: 'bg-red-500' };
      case 'pending':
        return { label: 'En attente', className: 'bg-yellow-500' };
      default:
        return { label: status, className: 'bg-gray-500' };
    }
  };
  
  const statusInfo = getStatusInfo(reservation.status);

  const reservationContent = (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium">
          Réservation de {reservation.guestName}
        </h3>
        <Badge className={statusInfo.className}>
          {statusInfo.label}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Coordonnées</h4>
            <div className="space-y-3">
              <p className="text-sm flex items-center">
                <User className="h-4 w-4 mr-2 opacity-70" />
                <span className="font-medium">Nom :</span> <span className="ml-1">{reservation.guestName || '-'}</span>
              </p>
              <p className="text-sm flex items-center">
                <Mail className="h-4 w-4 mr-2 opacity-70" />
                <span className="font-medium">Email :</span> <span className="ml-1">{reservation.guestEmail || '-'}</span>
              </p>
              <p className="text-sm flex items-center">
                <Phone className="h-4 w-4 mr-2 opacity-70" />
                <span className="font-medium">Téléphone :</span> <span className="ml-1">{reservation.guestPhone || '-'}</span>
              </p>
              <p className="text-sm flex items-center">
                <Home className="h-4 w-4 mr-2 opacity-70" />
                <span className="font-medium">Chambre :</span> <span className="ml-1">{reservation.roomNumber || '-'}</span>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Détails de la réservation</h4>
            <div className="space-y-3">
              <p className="text-sm flex items-center">
                <Calendar className="h-4 w-4 mr-2 opacity-70" />
                <span className="font-medium">Date :</span> <span className="ml-1">{format(new Date(reservation.date), 'dd MMMM yyyy', { locale: fr })}</span>
              </p>
              <p className="text-sm flex items-center">
                <Users className="h-4 w-4 mr-2 opacity-70" />
                <span className="font-medium">Participants :</span> <span className="ml-1">{reservation.guests}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Date de création :</span> <span className="ml-1">{format(new Date(reservation.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {reservation.specialRequests && (
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Demandes spéciales</h4>
            <p className="text-sm">{reservation.specialRequests}</p>
          </CardContent>
        </Card>
      )}
      
      {onUpdateStatus && (
        <div className="flex justify-end space-x-2 pt-4">
          {reservation.status !== 'confirmed' && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => onUpdateStatus(reservation.id, 'confirmed')}
              disabled={isUpdating}
              className="bg-green-500 hover:bg-green-600"
            >
              Confirmer
            </Button>
          )}
          {reservation.status !== 'cancelled' && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onUpdateStatus(reservation.id, 'cancelled')}
              disabled={isUpdating}
            >
              Annuler
            </Button>
          )}
          {reservation.status !== 'pending' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onUpdateStatus(reservation.id, 'pending')}
              disabled={isUpdating}
            >
              Marquer comme en attente
            </Button>
          )}
        </div>
      )}
    </div>
  );
  
  if (!onOpenChange || open === undefined) {
    return reservationContent;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails de la réservation</DialogTitle>
        </DialogHeader>
        {reservationContent}
      </DialogContent>
    </Dialog>
  );
};
