
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { NotificationItem } from '@/types/notification';

interface NotificationDetailContentProps {
  notification: NotificationItem;
}

export const NotificationDetailContent: React.FC<NotificationDetailContentProps> = React.memo(({
  notification
}) => {
  const navigate = useNavigate();
  
  // Redirect to the appropriate section based on notification type
  useEffect(() => {
    const timer = setTimeout(() => {
      switch (notification.type) {
        case 'request':
          navigate(`/requests/${notification.id}`);
          break;
        case 'reservation':
          navigate(`/dining/reservations/${notification.id}`);
          break;
        case 'spa_booking':
          navigate(`/spa/booking/${notification.id}`);
          break;
        default:
          // Stay on the current page for other notification types
          break;
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [notification.id, notification.type, navigate]);

  return (
    <Card className="p-6">
      <div className="flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
      <p className="text-center text-muted-foreground mt-4">
        Redirection en cours...
      </p>
    </Card>
  );
});

NotificationDetailContent.displayName = 'NotificationDetailContent';
