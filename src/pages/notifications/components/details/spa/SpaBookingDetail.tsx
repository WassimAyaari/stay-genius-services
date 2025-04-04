
import React from 'react';
import { NotificationItem } from '@/types/notification';
import { SpaBookingLoader } from './SpaBookingLoader';
import { useNavigate } from 'react-router-dom';

interface SpaBookingDetailProps {
  notification: NotificationItem;
}

export const SpaBookingDetail: React.FC<SpaBookingDetailProps> = React.memo(({ notification }) => {
  const navigate = useNavigate();
  
  // Instead of using useEffect with a timeout, just trigger navigation immediately
  navigate(`/spa/booking/${notification.id}`);
  
  return <SpaBookingLoader />;
});

SpaBookingDetail.displayName = 'SpaBookingDetail';
