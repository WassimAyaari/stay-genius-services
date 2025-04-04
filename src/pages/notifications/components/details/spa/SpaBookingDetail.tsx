
import React from 'react';
import { NotificationItem } from '@/types/notification';
import { SpaBookingLoader } from './SpaBookingLoader';
import { useNavigate } from 'react-router-dom';

interface SpaBookingDetailProps {
  notification: NotificationItem;
}

export const SpaBookingDetail: React.FC<SpaBookingDetailProps> = React.memo(({ notification }) => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // Redirect to the spa booking detail page after a short delay
    const timer = setTimeout(() => {
      navigate(`/spa/booking/${notification.id}`);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [notification.id, navigate]);
  
  return <SpaBookingLoader />;
});

SpaBookingDetail.displayName = 'SpaBookingDetail';
