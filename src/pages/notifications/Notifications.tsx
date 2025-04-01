import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useTableReservations } from '@/hooks/useTableReservations';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, Clock, Timer, ShowerHead, Shirt, PhoneCall, Wifi, FileText, Settings, Search, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ServiceRequest } from '@/features/rooms/types';
import { TableReservation } from '@/features/dining/types';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Notifications = () => {
  const { user, userData } = useAuth();
  const { data: serviceRequests = [], isLoading: isLoadingRequests, refetch: refetchRequests } = useServiceRequests();
  const { reservations = [], isLoading: isLoadingReservations, refetch: refetchReservations } = useTableReservations();
  
  const userId = user?.id || localStorage.getItem('user_id');
  const userEmail = user?.email || localStorage.getItem('user_email');

  console.log("Notifications page - auth user:", user?.id);
  console.log("Notifications page - userData:", userData);
  console.log("Notifications page - localStorage user_id:", localStorage.getItem('user_id'));
  console.log("Notifications page - localStorage user_email:", userEmail);
  console.log("Notifications page - service requests:", serviceRequests?.length);
  console.log("Notifications page - reservations:", reservations?.length);
  console.log("Notifications page - reservations data:", reservations);

  // Force refetch on mount to ensure we have the latest data
  useEffect(() => {
    refetchRequests();
    refetchReservations();
    
    // Store email in localStorage for future reference
    if (user?.email && !localStorage.getItem('user_email')) {
      localStorage.setItem('user_email', user.email);
    }
    if (userData?.email && !localStorage.getItem('user_email')) {
      localStorage.setItem('user_email', userData.email);
    }
  }, [refetchRequests, refetchReservations, user?.email, userData?.email]);

  // Effet pour rafraîchir les données en temps réel
  useEffect(() => {
    if (!userId && !userEmail) {
      console.log("No user ID or email found, not setting up real-time listeners");
      return;
    }
    
    console.log("Setting up real-time listeners with user ID:", userId, "and email:", userEmail);
    
    const channels = [];
    
    // Écouter les mises à jour de réservations par ID
    if (userId) {
      const reservationChannel = supabase
        .channel('notifications_page_reservation_updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'table_reservations',
          filter: `user_id=eq.${userId}`,
        }, (payload) => {
          console.log('Notification page - reservation update received by ID:', payload);
          
          // Show notification for status changes
          if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
            const statusMap: Record<string, string> = {
              'pending': 'est en attente',
              'confirmed': 'a été confirmée',
              'cancelled': 'a été annulée'
            };
            
            const status = payload.new.status;
            const message = statusMap[status] || 'a été mise à jour';
            
            const date = new Date(payload.new.date).toLocaleDateString('fr-FR');
            const time = payload.new.time;
            
            toast.info(`Mise à jour de réservation`, {
              description: `Votre réservation de table pour le ${date} à ${time} ${message}.`
            });
          }
          
          refetchReservations();
        })
        .subscribe();
      
      channels.push(reservationChannel);
    }
    
    // Écouter aussi par email si disponible
    if (userEmail) {
      const emailChannel = supabase
        .channel('notifications_page_email_updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'table_reservations',
          filter: `guest_email=eq.${userEmail}`,
        }, (payload) => {
          console.log('Notification page - reservation email update received:', payload);
          
          // Show notification for status changes
          if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
            const statusMap: Record<string, string> = {
              'pending': 'est en attente',
              'confirmed': 'a été confirmée',
              'cancelled': 'a été annulée'
            };
            
            const status = payload.new.status;
            const message = statusMap[status] || 'a été mise à jour';
            
            const date = new Date(payload.new.date).toLocaleDateString('fr-FR');
            const time = payload.new.time;
            
            toast.info(`Mise à jour de réservation`, {
              description: `Votre réservation de table pour le ${date} à ${time} ${message}.`
            });
          }
          
          refetchReservations();
        })
        .subscribe();
      
      channels.push(emailChannel);
    }
    
    // Écouter les mises à jour de demandes de service
    if (userId) {
      const serviceRequestChannel = supabase
        .channel('notifications_page_service_updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'service_requests',
          filter: `guest_id=eq.${userId}`,
        }, (payload) => {
          console.log('Notification page - service request update received:', payload);
          
          // Show notification for status changes
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
              description: `Votre demande de type ${payload.new.type} ${message}.`
            });
          }
          
          refetchRequests();
        })
        .subscribe();
      
      channels.push(serviceRequestChannel);
    }
    
    return () => {
      console.log("Cleaning up real-time listeners for notifications page");
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [userId, userEmail, refetchReservations, refetchRequests]);

  // Define a type for the combined notification items
  type NotificationItem = {
    id: string;
    type: 'request' | 'reservation';
    title: string;
    description: string;
    status: string;
    time: Date;
    link: string;
    data: ServiceRequest | TableReservation;
  };

  // Combine and sort notifications by time (newest first)
  const notifications: NotificationItem[] = [
    ...serviceRequests.map(request => ({
      id: request.id,
      type: 'request' as const,
      title: `Demande de service`,
      description: request.type,
      status: request.status,
      time: new Date(request.created_at),
      link: `/requests/${request.id}`,
      data: request
    })),
    ...reservations.map(reservation => ({
      id: reservation.id,
      type: 'reservation' as const,
      title: `Réservation de table`,
      description: `${reservation.guests} personnes le ${format(new Date(reservation.date), 'dd/MM/yyyy')} à ${reservation.time}`,
      status: reservation.status,
      time: new Date(reservation.createdAt),
      link: `/reservations/${reservation.id}`,
      data: reservation
    }))
  ].sort((a, b) => b.time.getTime() - a.time.getTime());

  const isLoading = isLoadingRequests || isLoadingReservations;
  const isAuthenticated = Boolean(user || localStorage.getItem('user_id'));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'confirmed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Timer className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeIcon = (notificationType: string, serviceType?: string) => {
    if (notificationType === 'reservation') {
      return <Utensils className="h-6 w-6" />;
    }
    
    if (!serviceType) {
      return <Search className="h-6 w-6" />;
    }
    
    switch (serviceType) {
      case 'housekeeping':
        return <ShowerHead className="h-6 w-6" />;
      case 'laundry':
        return <Shirt className="h-6 w-6" />;
      case 'wifi':
        return <Wifi className="h-6 w-6" />;
      case 'bill':
        return <FileText className="h-6 w-6" />;
      case 'preferences':
        return <Settings className="h-6 w-6" />;
      case 'concierge':
        return <PhoneCall className="h-6 w-6" />;
      default:
        return <Search className="h-6 w-6" />;
    }
  };

  const getStatusText = (status: string, type: string) => {
    if (type === 'reservation') {
      switch (status) {
        case 'confirmed': return 'Confirmée';
        case 'cancelled': return 'Annulée';
        case 'pending': return 'En attente';
        default: return 'Inconnu';
      }
    } else {
      switch (status) {
        case 'completed': return 'Complétée';
        case 'in_progress': return 'En cours';
        case 'cancelled': return 'Annulée';
        case 'pending': return 'En attente';
        default: return 'Inconnu';
      }
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Mes Notifications</h1>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : !isAuthenticated ? (
          <div className="text-center py-10 space-y-4">
            <p className="text-lg text-gray-600">Veuillez vous connecter pour voir vos notifications.</p>
            <Button asChild variant="default">
              <Link to="/auth/login">Se connecter</Link>
            </Button>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Link to={notification.link} key={`${notification.type}-${notification.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <div className="p-4 flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-full">
                      {notification.type === 'request' 
                        ? getTypeIcon(notification.type, (notification.data as ServiceRequest).type)
                        : getTypeIcon('reservation')}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium text-lg">{notification.title}</h3>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(notification.status)}
                          <span className="text-sm font-medium">
                            {getStatusText(notification.status, notification.type)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-1">{notification.description}</p>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(notification.time, { addSuffix: true, locale: fr })}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">Vous n'avez aucune notification pour le moment.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
