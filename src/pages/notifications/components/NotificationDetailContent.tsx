
import React from 'react';
import { Card } from '@/components/ui/card';
import { NotificationItem } from '@/types/notification';
import { RequestDetail } from './details/request/RequestDetail';
import { ReservationDetail } from './details/reservation/ReservationDetail';
import { SpaBookingDetail } from './details/spa/SpaBookingDetail';

interface NotificationDetailContentProps {
  notification: NotificationItem;
}

export const NotificationDetailContent: React.FC<NotificationDetailContentProps> = React.memo(({
  notification
}) => {
  // Render different detail components based on notification type
  const renderDetailComponent = () => {
    switch (notification.type) {
      case 'request':
        return <RequestDetail notification={notification} />;
      case 'reservation':
        return <ReservationDetail notification={notification} />;
      case 'spa_booking':
        return <SpaBookingDetail notification={notification} />;
      default:
        return (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              Détails non disponibles pour ce type de notification.
            </p>
          </Card>
        );
    }
  };

  return renderDetailComponent();
});

NotificationDetailContent.displayName = 'NotificationDetailContent';
