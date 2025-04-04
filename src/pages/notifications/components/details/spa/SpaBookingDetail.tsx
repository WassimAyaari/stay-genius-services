
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationItem } from '@/types/notification';
import { SpaBookingLoader } from './SpaBookingLoader';

interface SpaBookingDetailProps {
  notification: NotificationItem;
}

export const SpaBookingDetail: React.FC<SpaBookingDetailProps> = ({ notification }) => {
  const navigate = useNavigate();
  
  // Redirection vers la page SpaBookingDetails
  useEffect(() => {
    // Petit délai pour permettre l'animation de chargement
    const timer = setTimeout(() => {
      navigate(`/spa/booking/${notification.id}`);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [notification.id, navigate]);
  
  return <SpaBookingLoader />;
};
