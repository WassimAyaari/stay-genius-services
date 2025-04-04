
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { NotificationItem } from '@/types/notification';
import { SpaBookingDetailHeader } from './SpaBookingDetailHeader';
import { SpaBookingActions } from './SpaBookingActions';
import { SpaBookingLoader } from './SpaBookingLoader';
import { SpaBookingNotFound } from './SpaBookingNotFound';
import { useSpaBookingDetail } from './useSpaBookingDetail';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Clock, Calendar, User, Home } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SpaBookingDetailProps {
  notification: NotificationItem;
}

export const SpaBookingDetail: React.FC<SpaBookingDetailProps> = ({ notification }) => {
  const {
    booking,
    service,
    facility,
    isLoading,
    error,
    handleCancelBooking,
    handleViewDetails
  } = useSpaBookingDetail(notification);

  // Logs pour déboguer
  useEffect(() => {
    console.log('SpaBookingDetail rendering with booking data:', booking);
    console.log('SpaBookingDetail rendering with service data:', service);
    console.log('SpaBookingDetail rendering with facility data:', facility);
    console.log('SpaBookingDetail rendering with error:', error);
  }, [booking, service, facility, error]);

  if (isLoading) {
    return <SpaBookingLoader />;
  }

  if (error || !booking) {
    return <SpaBookingNotFound 
      onViewDetails={handleViewDetails} 
      bookingId={notification.id}
      errorMessage={error}
    />;
  }

  // Format date pour l'affichage
  let bookingDate;
  try {
    bookingDate = format(parseISO(booking.date), 'yyyy-MM-dd', { locale: fr });
  } catch (e) {
    console.error('Error formatting date:', e);
    bookingDate = booking.date;
  }

  // Déterminer si on peut montrer le temps restant
  const canShowTimeRemaining = booking.status === 'pending' || booking.status === 'confirmed';
  
  return (
    <Card className="shadow-sm">
      <SpaBookingDetailHeader status={booking.status} />
      
      <CardContent>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Détails de la réservation</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span>Date: {bookingDate}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span>Heure: {booking.time}</span>
            </div>
            
            {booking.room_number && (
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-gray-500" />
                <span>Chambre: {booking.room_number}</span>
              </div>
            )}
          </div>
          
          <div className="text-gray-500 text-sm">
            Réservation créée il y a environ 2 heures
          </div>
          
          {booking.status === 'confirmed' && (
            <Alert className="bg-green-50 border-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Réservation confirmée</AlertTitle>
              <AlertDescription className="text-green-700">
                Votre réservation a été confirmée par le spa.
              </AlertDescription>
            </Alert>
          )}
          
          {service && (
            <div>
              <h3 className="font-medium mb-2">Service sélectionné:</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-medium">{service.name}</p>
                <p className="text-sm text-gray-600">{service.description}</p>
                <div className="mt-2 flex justify-between">
                  <span className="text-sm text-gray-500">Durée: {service.duration}</span>
                  <span className="text-sm font-medium">{service.price} €</span>
                </div>
              </div>
            </div>
          )}
          
          <Separator />
          
          <SpaBookingActions 
            bookingId={notification.id} 
            status={booking.status} 
            onCancelBooking={handleCancelBooking} 
          />
        </div>
      </CardContent>
    </Card>
  );
};
