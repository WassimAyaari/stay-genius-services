
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
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

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
    handleViewDetails,
    handleRetry
  } = useSpaBookingDetail(notification);

  if (isLoading) {
    return <SpaBookingLoader />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Erreur de chargement</h3>
          <p className="text-gray-500 mb-4">
            Impossible de charger les détails de cette réservation.
          </p>
          <div className="flex justify-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Réessayer</span>
            </Button>
            <Button 
              onClick={handleViewDetails}
            >
              Voir la page détaillée
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!booking || !service) {
    return <SpaBookingNotFound onViewDetails={handleViewDetails} />;
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
