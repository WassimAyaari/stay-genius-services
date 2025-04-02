
import { useState, useEffect } from 'react';
import { NotificationItem } from '@/types/notification';
import { useNotifications } from '@/hooks/useNotifications';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useTableReservations } from '@/hooks/useTableReservations';
import { useSpaBookings } from '@/hooks/useSpaBookings';

export const useNotificationDetail = (type?: string, id?: string) => {
  const [notification, setNotification] = useState<NotificationItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Get data from various hooks
  const { notifications } = useNotifications();
  const { refetch: refetchServiceRequests } = useServiceRequests();
  const { refetch: refetchReservations } = useTableReservations();
  const { refetch: refetchSpaBookings } = useSpaBookings();
  
  useEffect(() => {
    const fetchData = async () => {
      if (!type || !id) {
        console.error('Missing notification parameters', { type, id });
        setError(new Error('Paramètres de notification invalides'));
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        console.log(`Fetching details for notification type: ${type}, id: ${id}`);
        
        // Refresh data based on notification type
        switch (type) {
          case 'request':
            await refetchServiceRequests();
            break;
          case 'reservation':
            await refetchReservations();
            break;
          case 'spa_booking':
            await refetchSpaBookings();
            break;
        }
        
        // Find notification in the list
        const foundNotification = notifications.find(
          n => n.id === id && n.type === type
        );
        
        console.log('Found notification:', foundNotification, 'from', notifications.length, 'notifications');
        
        if (foundNotification) {
          setNotification(foundNotification);
        } else {
          console.error('Notification not found in list', { type, id });
          setError(new Error('Notification introuvable'));
        }
      } catch (err) {
        console.error('Error fetching notification details:', err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [type, id, notifications, refetchServiceRequests, refetchReservations, refetchSpaBookings]);
  
  return { notification, isLoading, error };
};
