
import { useState, useEffect } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useTableReservations } from '@/hooks/useTableReservations';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { TableReservation } from '@/features/dining/types';
import { ServiceRequest } from '@/features/rooms/types';
import { NotificationItem } from '@/types/notification';
import { toast } from 'sonner';

export const useNotifications = () => {
  const { user } = useAuth();
  const userId = user?.id || localStorage.getItem('user_id');
  const userEmail = user?.email || localStorage.getItem('user_email');
  const { data: serviceRequests = [], refetch: refetchServices } = useServiceRequests();
  const { reservations = [], refetch: refetchReservations } = useTableReservations();
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  // Force a reload on component mount
  useEffect(() => {
    refetchServices();
    refetchReservations();
    
    // Store email in localStorage for future reference
    if (user?.email && !localStorage.getItem('user_email')) {
      localStorage.setItem('user_email', user.email);
    }
  }, [refetchServices, refetchReservations, user?.email]);

  // Effect to check for new notifications in real-time
  useEffect(() => {
    if (!userId && !userEmail) {
      console.log("No user ID or email found, not setting up real-time listeners in useNotifications");
      return;
    }
    
    console.log("useNotifications - Setting up real-time listeners with user ID:", userId, "and email:", userEmail);
    
    const channels = [];
    
    // Listen for reservation updates by user ID
    if (userId) {
      const reservationChannel = supabase
        .channel('notification_reservation_updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'table_reservations',
          filter: `user_id=eq.${userId}`,
        }, (payload) => {
          console.log('Notification reservation update received by ID:', payload);
          setHasNewNotifications(true);
          refetchReservations();
          
          // Afficher un toast pour les mises à jour de statut
          if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
            const statusMap: Record<string, string> = {
              'pending': 'est en attente',
              'confirmed': 'a été confirmée',
              'cancelled': 'a été annulée'
            };
            
            const status = payload.new.status;
            const message = statusMap[status] || 'a été mise à jour';
            
            toast.info(`Mise à jour de réservation`, {
              description: `Votre réservation de table ${message}.`
            });
          }
        })
        .subscribe();
      
      channels.push(reservationChannel);
    }
    
    // Also listen by email if available
    if (userEmail) {
      const emailChannel = supabase
        .channel('notification_reservation_email_updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'table_reservations',
          filter: `guest_email=eq.${userEmail}`,
        }, (payload) => {
          console.log('Notification reservation email update received:', payload);
          setHasNewNotifications(true);
          refetchReservations();
          
          // Afficher un toast pour les mises à jour de statut
          if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
            const statusMap: Record<string, string> = {
              'pending': 'est en attente',
              'confirmed': 'a été confirmée',
              'cancelled': 'a été annulée'
            };
            
            const status = payload.new.status;
            const message = statusMap[status] || 'a été mise à jour';
            
            toast.info(`Mise à jour de réservation`, {
              description: `Votre réservation de table ${message}.`
            });
          }
        })
        .subscribe();
      
      channels.push(emailChannel);
    }
    
    // Listen for service request updates
    if (userId) {
      const serviceChannel = supabase
        .channel('notification_service_updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'service_requests',
          filter: `guest_id=eq.${userId}`,
        }, (payload) => {
          console.log('Notification service update received:', payload);
          setHasNewNotifications(true);
          refetchServices();
          
          // Afficher un toast pour les mises à jour de statut
          if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
            const statusMap: Record<string, string> = {
              'pending': 'est en attente',
              'in_progress': 'est en cours de traitement',
              'completed': 'a été complétée',
              'cancelled': 'a été annulée'
            };
            
            const status = payload.new.status;
            const message = statusMap[status] || 'a été mise à jour';
            
            toast.info(`Mise à jour de demande`, {
              description: `Votre demande de service ${message}.`
            });
          }
        })
        .subscribe();
      
      channels.push(serviceChannel);
    }
    
    return () => {
      console.log("Cleaning up real-time listeners for notifications");
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [userId, userEmail, refetchReservations, refetchServices]);

  // Get restaurant name for reservation (mock since we don't fetch restaurant details here)
  const getRestaurantName = (reservation: TableReservation) => {
    return 'Restaurant';
  };

  const getRequestIcon = (type: string) => {
    switch (type) {
      case 'housekeeping': return '🧹';
      case 'laundry': return '👕';
      case 'wifi': return '📶';
      case 'room_service': return '🍲';
      case 'concierge': return '🔑';
      default: return '📋';
    }
  };

  // Combine and sort notifications by time (newest first)
  const notifications: NotificationItem[] = [
    ...serviceRequests.map(request => ({
      id: request.id,
      type: 'request' as const,
      title: `Demande de service ${getStatusText(request.status)}`,
      description: `Votre demande de type ${request.type} est ${getStatusText(request.status).toLowerCase()}`,
      icon: getRequestIcon(request.type),
      status: request.status,
      time: new Date(request.created_at),
      link: `/requests/${request.id}`
    })),
    ...reservations.map(reservation => ({
      id: reservation.id,
      type: 'reservation' as const,
      title: `Réservation ${getReservationStatusText(reservation.status)}`,
      description: `Votre réservation pour ${reservation.guests} personnes le ${new Date(reservation.date).toLocaleDateString('fr-FR')} à ${reservation.time}`,
      icon: '🍽️',
      status: reservation.status,
      time: new Date(reservation.createdAt),
      link: `/reservations/${reservation.id}`
    }))
  ].sort((a, b) => b.time.getTime() - a.time.getTime());

  function getStatusText(status: string) {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Complétée';
      case 'cancelled': return 'Annulée';
      default: return 'Inconnu';
    }
  }

  function getReservationStatusText(status: string) {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'cancelled': return 'Annulée';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  }

  const unreadCount = notifications.filter(n => 
    n.status === 'pending' || n.status === 'in_progress' || n.status === 'confirmed'
  ).length;

  const isAuthenticated = Boolean(userId);

  return {
    notifications,
    unreadCount,
    isAuthenticated,
    hasNewNotifications,
    setHasNewNotifications
  };
};
