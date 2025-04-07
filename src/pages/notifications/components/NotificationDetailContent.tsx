
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationItem } from '@/types/notification';
import { RequestDetail } from './details/request/RequestDetail';
import { SpaBookingDetail } from './details/spa/SpaBookingDetail';
import { Button } from '@/components/ui/button';

interface NotificationDetailContentProps {
  notification: NotificationItem;
  notificationType: string;
  notificationId: string;
}

const NotificationDetailContent: React.FC<NotificationDetailContentProps> = ({ 
  notification, 
  notificationType, 
  notificationId 
}) => {
  const navigate = useNavigate();
  
  // For each type of notification, redirect to the appropriate dedicated page
  React.useEffect(() => {
    switch (notificationType) {
      case 'request':
        navigate(`/requests/${notificationId}`);
        break;
      case 'reservation':
        navigate(`/dining/reservations/${notificationId}`);
        break;
      case 'spa_booking':
        navigate(`/spa/booking/${notificationId}`);
        break;
      case 'event_reservation':
        navigate(`/events/${notificationId}`);
        break;
      default:
        // No redirect for unknown types
        break;
    }
  }, [notificationType, notificationId, navigate]);
  
  // This will rarely render anything because of the redirects above,
  // but it serves as a fallback
  return (
    <div className="space-y-6">
      {/* Header based on notification type */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{notification.title}</h2>
        <Button variant="outline" onClick={() => navigate('/notifications')}>
          Retour aux notifications
        </Button>
      </div>
      
      {/* Content based on notification type */}
      {notificationType === 'request' && <RequestDetail requestId={notificationId} />}
      {notificationType === 'spa_booking' && <SpaBookingDetail bookingId={notificationId} />}
      
      {/* Fallback for types without dedicated components */}
      {notificationType !== 'request' && notificationType !== 'spa_booking' && (
        <div className="text-center py-8">
          <p>Redirection vers la page de détails...</p>
        </div>
      )}
    </div>
  );
};

export default NotificationDetailContent;
