
import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { NotificationItem } from '@/types/notification';

interface ReservationDetailInfoProps {
  notification: NotificationItem;
}

export const ReservationDetailInfo: React.FC<ReservationDetailInfoProps> = ({ notification }) => {
  // Format time safely
  const getSafeTimeAgo = (date: Date) => {
    try {
      return formatDistanceToNow(date, { addSuffix: true, locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'récemment';
    }
  };

  const creationDate = notification.time || new Date();

  return (
    <div className="rounded-md bg-gray-50 p-4">
      <h3 className="font-medium mb-2">Détails de la réservation</h3>
      <div className="space-y-2 text-sm">
        {notification.data?.date && (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>Date: {notification.data.date}</span>
          </div>
        )}
        
        {notification.data?.time && (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>Heure: {notification.data.time}</span>
          </div>
        )}
        
        {notification.data?.guests && (
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            <span>Personnes: {notification.data.guests}</span>
          </div>
        )}
        
        {notification.data?.room_number && (
          <div className="flex items-center">
            <span className="font-medium mr-2">Chambre:</span> {notification.data.room_number}
          </div>
        )}
        
        {notification.data?.special_requests && (
          <div>
            <span className="font-medium block">Demandes spéciales:</span>
            <p className="mt-1 text-gray-600">{notification.data.special_requests}</p>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500 mt-4">
        Réservation créée {getSafeTimeAgo(creationDate)}
      </div>
    </div>
  );
};
