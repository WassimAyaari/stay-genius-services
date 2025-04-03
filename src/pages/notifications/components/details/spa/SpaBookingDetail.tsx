
import React from 'react';
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
    handleCancelBooking,
    handleViewDetails
  } = useSpaBookingDetail(notification);

  console.log('SpaBookingDetail render:', { booking, service, facility, isLoading, notificationId: notification?.id });

  if (isLoading) {
    return <SpaBookingLoader />;
  }

  if (!booking || !service) {
    return <SpaBookingNotFound onViewDetails={handleViewDetails} bookingId={notification.id} />;
  }

  return (
    <Card>
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
