
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { NotificationItem } from '@/types/notification';
import { SpaBookingDetailHeader } from './SpaBookingDetailHeader';
import { SpaBookingServiceInfo } from './SpaBookingServiceInfo';
import { SpaBookingFacilityInfo } from './SpaBookingFacilityInfo';
import { SpaBookingDateInfo } from './SpaBookingDateInfo';
import { SpaBookingContactInfo } from './SpaBookingContactInfo';
import { SpaBookingActions } from './SpaBookingActions';
import { SpaBookingLoader } from './SpaBookingLoader';
import { SpaBookingNotFound } from './SpaBookingNotFound';
import { useSpaBookingDetail } from './useSpaBookingDetail';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Clock } from 'lucide-react';
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

  // Ajouter des logs pour déboguer l'affichage des données
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

  // Format date for display
  let bookingDate;
  try {
    bookingDate = format(parseISO(booking.date), 'dd MMMM yyyy', { locale: fr });
  } catch (e) {
    console.error('Error formatting date:', e);
    bookingDate = booking.date;
  }

  // Calculate time remaining if status is pending or confirmed
  const canShowTimeRemaining = booking.status === 'pending' || booking.status === 'confirmed';
  
  return (
    <Card className="shadow-sm">
      <SpaBookingDetailHeader status={booking.status} />
      
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Réservation de spa</h2>
            <p className="text-gray-500">{bookingDate} à {booking.time}</p>
            
            {booking.room_number && (
              <p className="text-sm text-gray-600">Chambre: {booking.room_number}</p>
            )}
            
            {canShowTimeRemaining && (
              <div className="flex items-center text-gray-500 text-sm mt-2">
                <Clock className="h-4 w-4 mr-1" />
                <span>Il y a environ 1 heure</span>
              </div>
            )}
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
          
          <div className="pt-2">
            <h3 className="font-medium mb-2">Résumé:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Date: {bookingDate}</li>
              <li>Heure: {booking.time}</li>
              {booking.room_number && <li>Chambre: {booking.room_number}</li>}
            </ul>
          </div>
          
          {service && (
            <SpaBookingServiceInfo service={service} />
          )}
          
          <div className="grid md:grid-cols-2 gap-6">
            <SpaBookingFacilityInfo facility={facility} />
            <SpaBookingDateInfo date={booking.date} time={booking.time} />
          </div>
          
          <Separator />
          
          <SpaBookingContactInfo booking={booking} />
          
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
