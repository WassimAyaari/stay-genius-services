
import { useState, useEffect, useCallback } from 'react';
import { NotificationItem } from '@/types/notification';
import { useNotifications } from '@/hooks/useNotifications';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useTableReservations } from '@/hooks/useTableReservations';
import { useSpaBookings } from '@/hooks/useSpaBookings';

export const useNotificationDetail = (type?: string, id?: string) => {
  const [notification, setNotification] = useState<NotificationItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Obtenir les données des différents hooks
  const { notifications } = useNotifications();
  const { refetch: refetchServiceRequests } = useServiceRequests();
  const { refetch: refetchReservations } = useTableReservations();
  const { refetch: refetchSpaBookings } = useSpaBookings();
  
  // Mémoriser la fonction fetchData pour éviter des rendus inutiles
  const fetchData = useCallback(async () => {
    if (!type || !id) {
      setError(new Error('Paramètres de notification invalides'));
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Vérifier d'abord si la notification existe déjà dans la liste
      const existingNotification = notifications.find(
        n => n.id === id && n.type === type
      );
      
      if (!existingNotification) {
        // Actualiser les données en fonction du type de notification
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
          // Pas besoin de rafraîchir pour les notifications générales
        }
      }
      
      // Chercher la notification dans la liste mise à jour
      const foundNotification = notifications.find(
        n => n.id === id && n.type === type
      );
      
      if (foundNotification) {
        setNotification(foundNotification);
      } else {
        setError(new Error('Notification introuvable'));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
    } finally {
      setIsLoading(false);
    }
  }, [type, id, notifications, refetchServiceRequests, refetchReservations, refetchSpaBookings]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return { notification, isLoading, error };
};
