
import React from 'react';
import { NotificationItem } from '@/types/notification';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface EventReservationDetailProps {
  notification: NotificationItem;
}

export const EventReservationDetail: React.FC<EventReservationDetailProps> = ({ notification }) => {
  return (
    <div className="space-y-4">
      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription>
            La fonctionnalité de réservation d'événements a été désactivée.
          </AlertDescription>
        </div>
      </Alert>
      
      <div className="p-4 border rounded-md">
        <h3 className="font-medium mb-2">Détails de l'événement</h3>
        <p className="text-sm text-gray-600">{notification.description}</p>
      </div>
    </div>
  );
};
