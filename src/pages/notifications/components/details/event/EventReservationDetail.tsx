
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { NotificationItem } from '@/types/notification';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, Users, Clock, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface EventReservationDetailProps {
  notification: NotificationItem;
}

export const EventReservationDetail: React.FC<EventReservationDetailProps> = ({ notification }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'cancelled':
        return 'Annulée';
      default:
        return 'En attente';
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Date non spécifiée';
    try {
      return format(new Date(dateStr), 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      <Badge className={`${getStatusColor(notification.status)}`}>
        {getStatusText(notification.status)}
      </Badge>

      {notification.data && (
        <>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Détails de la réservation</h3>
              <Separator className="mb-4" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  <span>Date: {formatDate(notification.data.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Personnes: {notification.data.guests || 1}</span>
                </div>
                {notification.data.room_number && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Chambre:</span> {notification.data.room_number}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Réservé le: {format(notification.time, 'dd/MM/yyyy à HH:mm', { locale: fr })}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {notification.data.special_requests && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Demandes spéciales</h3>
                <Separator className="mb-4" />
                <div className="flex gap-2">
                  <MessageSquare className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                  <p>{notification.data.special_requests}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
