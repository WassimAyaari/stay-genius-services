
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

  if (!service) {
    return <SpaBookingNotFound 
      onViewDetails={handleViewDetails} 
      bookingId={notification.id}
      errorMessage="Les détails du service pour cette réservation sont introuvables"
    />;
  }

  return (
    <Card className="shadow-sm">
      <SpaBookingDetailHeader status={booking.status} />
      
      <CardContent>
        <div className="space-y-6">
          <SpaBookingServiceInfo service={service} />
          
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
