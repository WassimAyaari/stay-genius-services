
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  MapPin, 
  User, 
  Home, 
  FileText, 
  Utensils, 
  ShowerHead,
  CheckCircle,
  XCircle,
  Clock8
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from '@/types/notification';

const NotificationDetails = () => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [notificationData, setNotificationData] = useState<NotificationItem | null>(null);
  const { notifications } = useNotifications();

  useEffect(() => {
    if (!id || !type) {
      toast.error("Informations manquantes");
      navigate('/notifications');
      return;
    }

    // Find the notification in the existing notifications list
    const foundNotification = notifications.find(n => n.id === id && n.type === type);
    
    if (foundNotification) {
      setNotificationData(foundNotification);
      setIsLoading(false);
    } else {
      // If not found in the list, we could try to fetch it directly from the database
      // This would be useful for older notifications that might not be in the current list
      fetchNotificationDetails();
    }
  }, [id, type, navigate, notifications]);

  const fetchNotificationDetails = async () => {
    setIsLoading(true);
    try {
      let data;
      
      if (type === 'spa_booking' && id) {
        const { data: bookingData, error } = await supabase
          .from('spa_bookings')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        data = bookingData;
      } else if (type === 'reservation' && id) {
        const { data: reservationData, error } = await supabase
          .from('table_reservations')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        data = reservationData;
      } else if (type === 'request' && id) {
        const { data: requestData, error } = await supabase
          .from('service_requests')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        data = requestData;
      }
      
      if (data) {
        // Transform the data to match NotificationItem format
        const notification: NotificationItem = {
          id: id || '',
          type: type as 'request' | 'reservation' | 'spa_booking',
          title: getNotificationTitle(type),
          description: getNotificationDescription(data),
          icon: getNotificationIcon(type),
          status: data.status || 'pending',
          time: new Date(data.created_at),
          link: getNotificationLink(type, id),
          data: {
            room_number: data.room_number,
            date: data.date,
            time: data.time,
            guests: data.guests,
            service_type: data.type || data.service_type,
            description: data.description || data.special_requests
          }
        };
        
        setNotificationData(notification);
      } else {
        toast.error("Notification introuvable");
        navigate('/notifications');
      }
    } catch (error) {
      console.error('Error fetching notification:', error);
      toast.error("Erreur lors du chargement des détails");
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationTitle = (type: string | undefined) => {
    switch(type) {
      case 'spa_booking': return 'Réservation de spa';
      case 'reservation': return 'Réservation de restaurant';
      case 'request': return 'Demande de service';
      default: return 'Notification';
    }
  };

  const getNotificationDescription = (data: any) => {
    if (!data) return '';
    
    switch(data.type) {
      case 'spa_booking': return `Réservation pour ${data.date} à ${data.time}`;
      case 'reservation': return `Réservation pour ${data.guests} personne(s) le ${data.date} à ${data.time}`;
      case 'request': return data.description || 'Demande de service';
      default: return data.description || '';
    }
  };

  const getNotificationIcon = (type: string | undefined) => {
    switch(type) {
      case 'spa_booking': return 'ShowerHead';
      case 'reservation': return 'Utensils';
      case 'request': return 'FileText';
      default: return 'Bell';
    }
  };

  const getNotificationLink = (type: string | undefined, id: string | undefined) => {
    if (!id) return '/notifications';
    
    switch(type) {
      case 'spa_booking': return `/spa/booking/${id}`;
      case 'reservation': return `/dining/reservation/${id}`;
      case 'request': return `/my-room/request/${id}`;
      default: return '/notifications';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Complétée';
      case 'cancelled': return 'Annulée';
      case 'confirmed': return 'Confirmée';
      default: return 'En attente';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock8 className="h-4 w-4 text-yellow-600" />;
    }
  };

  const handleCancelAction = async () => {
    if (!notificationData) return;
    
    try {
      let success = false;
      
      if (notificationData.type === 'spa_booking') {
        const { error } = await supabase
          .from('spa_bookings')
          .update({ status: 'cancelled' })
          .eq('id', notificationData.id);
          
        if (error) throw error;
        success = true;
      } else if (notificationData.type === 'reservation') {
        const { error } = await supabase
          .from('table_reservations')
          .update({ status: 'cancelled' })
          .eq('id', notificationData.id);
          
        if (error) throw error;
        success = true;
      } else if (notificationData.type === 'request') {
        const { error } = await supabase
          .from('service_requests')
          .update({ status: 'cancelled' })
          .eq('id', notificationData.id);
          
        if (error) throw error;
        success = true;
      }
      
      if (success) {
        toast.success("Annulation réussie");
        setNotificationData({
          ...notificationData,
          status: 'cancelled'
        });
      }
    } catch (error) {
      console.error('Error cancelling:', error);
      toast.error("Erreur lors de l'annulation");
    }
  };

  const renderNotificationDetails = () => {
    if (!notificationData) return null;
    
    const { type, title, status, time, data } = notificationData;
    
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="relative pb-2">
          <div className="absolute top-4 right-4">
            <Badge className={`${getStatusColor(status)} flex items-center gap-1`}>
              {getStatusIcon(status)}
              <span>{getStatusText(status)}</span>
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {type === 'spa_booking' && <ShowerHead className="h-5 w-5 text-blue-600" />}
            {type === 'reservation' && <Utensils className="h-5 w-5 text-orange-600" />}
            {type === 'request' && <FileText className="h-5 w-5 text-purple-600" />}
            <CardTitle>{title}</CardTitle>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            <Clock className="inline-block h-4 w-4 mr-1" />
            {time instanceof Date ? time.toLocaleDateString('fr-FR', { 
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Date inconnue'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
            <h3 className="font-semibold text-lg mb-3">Confirmation</h3>
            {status === 'confirmed' || status === 'in_progress' ? (
              <p className="text-green-700">
                Votre {type === 'spa_booking' ? 'réservation de spa' : type === 'reservation' ? 'réservation de restaurant' : 'demande de service'} a été confirmée. 
                Merci de votre confiance !
              </p>
            ) : status === 'cancelled' ? (
              <p className="text-red-700">
                Cette {type === 'spa_booking' ? 'réservation de spa' : type === 'reservation' ? 'réservation de restaurant' : 'demande de service'} a été annulée.
              </p>
            ) : (
              <p className="text-yellow-700">
                Votre {type === 'spa_booking' ? 'réservation de spa' : type === 'reservation' ? 'réservation de restaurant' : 'demande de service'} est en attente de confirmation.
                Nous vous contacterons dès que possible.
              </p>
            )}
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold">Détails</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mt-2">
              {data?.date && (
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-gray-700">{data.date}</p>
                  </div>
                </div>
              )}
              
              {data?.time && (
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Heure</p>
                    <p className="text-sm text-gray-700">{data.time}</p>
                  </div>
                </div>
              )}
              
              {data?.guests && (
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Personnes</p>
                    <p className="text-sm text-gray-700">{data.guests}</p>
                  </div>
                </div>
              )}
              
              {data?.service_type && (
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Type de service</p>
                    <p className="text-sm text-gray-700">{data.service_type}</p>
                  </div>
                </div>
              )}
              
              {data?.room_number && (
                <div className="flex items-start gap-2">
                  <Home className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Chambre</p>
                    <p className="text-sm text-gray-700">{data.room_number}</p>
                  </div>
                </div>
              )}
            </div>
            
            {data?.description && (
              <div className="mt-4 pt-2 border-t">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Demandes spéciales</p>
                    <p className="text-sm text-gray-700">{data.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={() => navigate('/notifications')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          
          {(status === 'pending' || status === 'confirmed' || status === 'in_progress') && (
            <Button variant="destructive" onClick={handleCancelAction}>
              <XCircle className="h-4 w-4 mr-2" />
              Annuler
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        {renderNotificationDetails()}
      </div>
    </Layout>
  );
};

export default NotificationDetails;
