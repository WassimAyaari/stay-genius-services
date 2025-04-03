
import { useState, useEffect } from 'react';
import { NotificationItem } from '@/types/notification';
import { useNotifications } from '@/hooks/useNotifications';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useTableReservations } from '@/hooks/useTableReservations';
import { useSpaBookings } from '@/hooks/useSpaBookings';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
            
            // For spa bookings, we'll try to fetch directly from the database if not found in notifications
            const foundInList = notifications.find(n => n.id === id && n.type === type);
            if (!foundInList) {
              console.log('Spa booking not found in notifications list, trying direct fetch');
              const { data: bookingData, error: bookingError } = await supabase
                .from('spa_bookings')
                .select('*')
                .eq('id', id)
                .maybeSingle();
                
              if (bookingError) {
                console.error('Error fetching spa booking directly:', bookingError);
              } else if (bookingData) {
                // Create a notification item from the booking data
                const directNotification: NotificationItem = {
                  id: bookingData.id,
                  type: 'spa_booking',
                  title: 'Réservation de spa',
                  description: `${bookingData.date} à ${bookingData.time}`,
                  icon: '💆',
                  status: bookingData.status || 'pending',
                  time: new Date(bookingData.created_at || Date.now()),
                  link: `/spa/booking/${bookingData.id}`,
                  data: {
                    date: bookingData.date,
                    time: bookingData.time,
                    service_id: bookingData.service_id,
                    room_number: bookingData.room_number,
                    special_requests: bookingData.special_requests
                  }
                };
                
                console.log('Created direct notification from booking data:', directNotification);
                setNotification(directNotification);
                setIsLoading(false);
                return;
              }
            }
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
          toast.error('Détails de la notification introuvables');
        }
      } catch (err) {
        console.error('Error fetching notification details:', err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        toast.error('Erreur lors du chargement des détails');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [type, id, notifications, refetchServiceRequests, refetchReservations, refetchSpaBookings]);
  
  return { notification, isLoading, error };
};
