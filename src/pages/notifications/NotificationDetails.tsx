
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User, FileText, ChevronLeft, Ticket } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { NotificationItem } from '@/types/notification';

const NotificationDetails = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<NotificationItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch the notification from an API
    // For now, we'll simulate the fetch with setTimeout
    setIsLoading(true);
    
    setTimeout(() => {
      // Mock data based on the type and id
      const mockNotification: NotificationItem = {
        id: id || '1',
        type: (type as 'request' | 'reservation' | 'spa_booking') || 'request',
        title: type === 'reservation' ? 'Réservation au Restaurant' : 
               type === 'spa_booking' ? 'Réservation au Spa' : 'Demande de Service',
        description: 'Détails de votre réservation',
        icon: '',
        status: 'confirmed',
        time: new Date(),
        link: `/notifications/${type}/${id}`,
        data: {
          room_number: '302',
          date: '2023-10-15',
          time: '19:30',
          guests: 2,
          service_type: type === 'request' ? 'Nettoyage' : undefined,
          special_requests: 'Table près de la fenêtre'
        }
      };
      
      setNotification(mockNotification);
      setIsLoading(false);
    }, 500);
  }, [type, id]);

  const handleBack = () => {
    navigate('/notifications');
  };

  const handleCancel = () => {
    // In a real app, this would call an API to cancel the reservation/request
    alert('Cette fonctionnalité sera bientôt disponible');
    navigate('/notifications');
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

  const renderTypeSpecificDetails = () => {
    if (!notification) return null;

    switch (notification.type) {
      case 'reservation':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span>{notification.data?.guests} personnes</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{notification.data?.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{notification.data?.time}</span>
            </div>
            {notification.data?.room_number && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>Chambre {notification.data.room_number}</span>
              </div>
            )}
          </div>
        );
      case 'spa_booking':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{notification.data?.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{notification.data?.time}</span>
            </div>
            {notification.data?.room_number && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>Chambre {notification.data.room_number}</span>
              </div>
            )}
          </div>
        );
      case 'request':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span>{notification.data?.service_type}</span>
            </div>
            {notification.data?.room_number && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>Chambre {notification.data.room_number}</span>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleBack} className="mr-2">
              <ChevronLeft className="h-4 w-4 mr-1" /> Retour
            </Button>
            <h1 className="text-2xl font-bold">Chargement...</h1>
          </div>
          <Card className="animate-pulse">
            <CardContent className="p-10">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!notification) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleBack} className="mr-2">
              <ChevronLeft className="h-4 w-4 mr-1" /> Retour
            </Button>
            <h1 className="text-2xl font-bold">Notification introuvable</h1>
          </div>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">Cette notification n'existe pas ou a été supprimée.</p>
              <Button className="mt-4" onClick={handleBack}>Retour aux notifications</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const canCancel = ['pending', 'confirmed', 'in_progress'].includes(notification.status);
  const typeTitle = notification.type === 'reservation' ? 'Réservation de restaurant' :
                   notification.type === 'spa_booking' ? 'Réservation de spa' : 'Demande de service';

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBack} className="mr-2">
            <ChevronLeft className="h-4 w-4 mr-1" /> Retour
          </Button>
          <h1 className="text-2xl font-bold">{typeTitle}</h1>
        </div>

        <Card className="border-2 border-dashed border-gray-200 overflow-hidden">
          <CardHeader className="bg-gray-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">{notification.title}</CardTitle>
              <Badge className={getStatusColor(notification.status)}>
                {getStatusText(notification.status)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <h3 className="font-medium text-lg mb-3">Confirmation</h3>
              <p className="text-gray-700 mb-4">
                {notification.type === 'reservation' && 'Nous avons le plaisir de confirmer votre réservation au restaurant.'}
                {notification.type === 'spa_booking' && 'Nous avons le plaisir de confirmer votre réservation au spa.'}
                {notification.type === 'request' && 'Votre demande de service a été enregistrée et sera traitée dans les plus brefs délais.'}
              </p>

              <div className="border border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Ticket className="h-4 w-4" /> Détails
                </h4>
                {renderTypeSpecificDetails()}
                
                {notification.data?.special_requests && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <h4 className="font-medium mb-1">Demandes spéciales:</h4>
                    <p className="text-gray-700">{notification.data.special_requests}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          <Separator />

          <CardFooter className="p-6 bg-gray-50 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Référence: {notification.id.substring(0, 8).toUpperCase()}
            </p>
            {canCancel && (
              <Button variant="destructive" onClick={handleCancel}>
                Annuler
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default NotificationDetails;
