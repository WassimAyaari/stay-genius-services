
import React from 'react';
import { NotificationItem } from '@/types/notification';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarIcon, Users, Clock, MapPin, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEvents } from '@/hooks/useEvents'; 

interface EventReservationDetailProps {
  notification: NotificationItem;
}

export const EventReservationDetail: React.FC<EventReservationDetailProps> = ({ notification }) => {
  const navigate = useNavigate();
  const { events, loading } = useEvents();
  const eventId = notification.data?.event_id;
  const event = events.find(e => e.id === eventId);

  const handleViewReservation = () => {
    navigate(`/events/reservation/${notification.id}`);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'EEEE d MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateStr;
    }
  };

  // Show status badge
  const getStatusBadge = (status: string) => {
    let bgColor = '';
    let textColor = '';
    let statusText = '';

    switch (status) {
      case 'confirmed':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        statusText = 'Confirmée';
        break;
      case 'cancelled':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        statusText = 'Annulée';
        break;
      default:
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        statusText = 'En attente';
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {statusText}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CalendarIcon className="h-5 w-5 text-primary mr-2" />
          <h2 className="font-semibold">
            Détails de votre réservation d'événement
          </h2>
        </div>
        <div>{getStatusBadge(notification.status)}</div>
      </div>
      
      {event && (
        <div className="border rounded-md overflow-hidden">
          <div className="h-40 bg-gray-200">
            <img 
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg">{event.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center text-sm">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span>{formatDate(notification.data?.date || '')}</span>
              </div>
              
              {event.time && (
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{event.time}</span>
                </div>
              )}
              
              {event.location && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{event.location}</span>
                </div>
              )}
              
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-gray-500" />
                <span>{notification.data?.guests} personne(s)</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!event && !loading && (
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription>
              Les détails de l'événement ne sont pas disponibles.
            </AlertDescription>
          </div>
        </Alert>
      )}
      
      <div className="mt-4">
        <Button onClick={handleViewReservation} className="w-full">
          Voir les détails complets
        </Button>
      </div>
    </div>
  );
};
