
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NotificationItem } from '@/types/notification';
import { Badge } from '@/components/ui/badge';
import { ShowerHead, Calendar, Clock, Home, ArrowLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSpaBookingDetail } from './useSpaBookingDetail';
import { SpaBookingLoader } from './SpaBookingLoader';
import { SpaBookingNotFound } from './SpaBookingNotFound';
import { useNavigate } from 'react-router-dom';

interface SpaBookingDetailProps {
  notification: NotificationItem;
}

export const SpaBookingDetail: React.FC<SpaBookingDetailProps> = ({ notification }) => {
  const navigate = useNavigate();
  const {
    booking,
    service,
    isLoading,
    error,
    handleCancelBooking,
  } = useSpaBookingDetail(notification);

  const handleBack = () => {
    navigate('/notifications');
  };

  if (isLoading) {
    return <SpaBookingLoader />;
  }

  if (error || !booking) {
    return (
      <SpaBookingNotFound 
        onViewDetails={handleBack} 
        bookingId={notification.id}
        errorMessage={error}
      />
    );
  }

  // Format the date for display
  let formattedDate;
  try {
    formattedDate = format(parseISO(booking.date), 'PPPP', { locale: fr });
  } catch (e) {
    console.error('Error formatting date:', e);
    formattedDate = booking.date;
  }

  // Get the appropriate status label and badge color
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'completed': return 'Complétée';
      case 'cancelled': return 'Annulée';
      case 'in_progress': return 'En cours';
      default: return 'En attente';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };
  
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="mb-2 -ml-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour aux notifications
        </Button>
        
        <h1 className="text-2xl font-bold">Réservation de spa</h1>
        <div className="text-sm text-muted-foreground">
          Réservation spa
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-2 rounded-full mr-3">
                <ShowerHead className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium">Résumé</h2>
                <p className="text-sm text-gray-500">{formattedDate} à {booking.time}</p>
              </div>
            </div>
            <Badge className={getStatusBadgeClass(booking.status)}>
              {getStatusLabel(booking.status)}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <ul className="space-y-2 list-none">
              <li>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Date: {formattedDate}</span>
                </span>
              </li>
              <li>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Heure: {booking.time}</span>
                </span>
              </li>
              {booking.room_number && (
                <li>
                  <span className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-gray-500" />
                    <span>Chambre: {booking.room_number}</span>
                  </span>
                </li>
              )}
            </ul>
              
            <Separator className="my-4" />
            
            <div className="flex flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
              >
                Modifier
              </Button>
              
              {canCancel && (
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleCancelBooking(notification.id)}
                >
                  Annuler
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
