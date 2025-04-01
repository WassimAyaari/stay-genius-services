import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useTableReservations } from '@/hooks/useTableReservations';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { TableReservation } from '@/features/dining/types';
import { ServiceRequest } from '@/features/rooms/types';
import { supabase } from '@/integrations/supabase/client';

const NotificationMenu = () => {
  const { user } = useAuth();
  const userId = user?.id || localStorage.getItem('user_id');
  const userEmail = user?.email || localStorage.getItem('user_email');
  const { data: serviceRequests = [], refetch: refetchServices } = useServiceRequests();
  const { reservations = [], refetch: refetchReservations } = useTableReservations();
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  console.log("NotificationMenu - auth user ID or localStorage ID:", userId);
  console.log("NotificationMenu - auth user email or localStorage email:", userEmail);
  console.log("NotificationMenu - serviceRequests count:", serviceRequests?.length);
  console.log("NotificationMenu - reservations count:", reservations?.length);
  console.log("NotificationMenu - reservations data:", reservations);

  // Forcer un rechargement au montage
  useEffect(() => {
    refetchServices();
    refetchReservations();
    
    // Store email in localStorage for future reference
    if (user?.email && !localStorage.getItem('user_email')) {
      localStorage.setItem('user_email', user.email);
    }
  }, [refetchServices, refetchReservations, user?.email]);

  // Effet pour vérifier les nouvelles notifications en temps réel
  useEffect(() => {
    if (!userId && !userEmail) {
      console.log("No user ID or email found, not setting up real-time listeners in NotificationMenu");
      return;
    }
    
    console.log("NotificationMenu - Setting up real-time listeners with user ID:", userId, "and email:", userEmail);
    
    const channels = [];
    
    // Écouter les mises à jour de réservations par ID utilisateur
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
        })
        .subscribe();
      
      channels.push(reservationChannel);
    }
    
    // Écouter aussi par email si disponible
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
        })
        .subscribe();
      
      channels.push(emailChannel);
    }
    
    // Écouter les mises à jour de demandes de service
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
        })
        .subscribe();
      
      channels.push(serviceChannel);
    }
    
    return () => {
      console.log("Cleaning up real-time listeners for notifications");
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [userId, userEmail, refetchReservations, refetchServices]);

  // Réinitialiser l'indicateur de nouvelles notifications lorsque le menu est ouvert
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setHasNewNotifications(false);
    }
  };

  // Define a type for combined notifications
  type NotificationItem = {
    id: string;
    type: 'request' | 'reservation';
    title: string;
    description: string;
    icon: string;
    status: string;
    time: Date;
    link: string;
  };

  // Get restaurant name for reservation (mock since we don't fetch restaurant details here)
  const getRestaurantName = (reservation: TableReservation) => {
    return 'Restaurant';
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

  const unreadCount = notifications.filter(n => 
    n.status === 'pending' || n.status === 'in_progress' || n.status === 'confirmed'
  ).length;

  const isAuthenticated = Boolean(userId);

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

  function getRequestIcon(type: string) {
    switch (type) {
      case 'housekeeping': return '🧹';
      case 'laundry': return '👕';
      case 'wifi': return '📶';
      case 'room_service': return '🍲';
      case 'concierge': return '🔑';
      default: return '📋';
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'confirmed':
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Bell className={`h-5 w-5 ${hasNewNotifications ? 'text-primary' : 'text-gray-600'}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-primary rounded-full text-[10px] text-white flex items-center justify-center font-medium border border-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-zinc-100">
        <DropdownMenuLabel>Notifications ({notifications.length})</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-80 overflow-y-auto">
          {!isAuthenticated ? (
            <div className="py-4 text-center text-sm text-gray-500">
              Connectez-vous pour voir vos notifications
            </div>
          ) : notifications.length > 0 ? (
            <DropdownMenuGroup>
              {notifications.map((notification) => (
                <Link to={notification.link} key={`${notification.type}-${notification.id}`}>
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-200/70">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200">
                        <span className="text-lg">{notification.icon}</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(notification.status)}`}>
                          {notification.type === 'request' ? getStatusText(notification.status) : getReservationStatusText(notification.status)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{notification.description}</p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(notification.time, { addSuffix: true, locale: fr })}
                      </p>
                    </div>
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuGroup>
          ) : (
            <div className="py-4 text-center text-sm text-gray-500">
              Aucune notification
            </div>
          )}
        </div>
        
        <DropdownMenuSeparator />
        <Link to="/notifications">
          <DropdownMenuItem className="text-center cursor-pointer hover:bg-gray-200/70">
            <span className="w-full text-center text-primary font-medium">
              Voir toutes les notifications
            </span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
