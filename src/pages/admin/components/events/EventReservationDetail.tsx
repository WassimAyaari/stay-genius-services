
import React from 'react';
import { EventReservation } from '@/types/event';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EventReservationDetailProps {
  reservation: EventReservation;
}

export const EventReservationDetail: React.FC<EventReservationDetailProps> = ({ reservation }) => {
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

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium">
          Réservation de {reservation.guestName || 'Client'}
        </h3>
        <Badge className={statusInfo.className}>
          {statusInfo.label}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Coordonnées</h4>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Nom :</span> {reservation.guestName || '-'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email :</span> {reservation.guestEmail || '-'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Téléphone :</span> {reservation.guestPhone || '-'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Chambre :</span> {reservation.roomNumber || '-'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Détails de la réservation</h4>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Date :</span> {format(new Date(reservation.date), 'dd MMMM yyyy', { locale: fr })}
              </p>
              <p className="text-sm">
                <span className="font-medium">Nombre de participants :</span> {reservation.guests}
              </p>
              <p className="text-sm">
                <span className="font-medium">Date de création :</span> {format(new Date(reservation.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
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
    </div>
  );
};
