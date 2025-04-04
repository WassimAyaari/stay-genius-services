
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
import { toast } from '@/hooks/use-toast';
import { SpaBookingDateInfo } from './SpaBookingDateInfo';
import { SpaBookingServiceInfo } from './SpaBookingServiceInfo';
import { SpaBookingFacilityInfo } from './SpaBookingFacilityInfo';
import { SpaBookingContactInfo } from './SpaBookingContactInfo';

interface SpaBookingDetailProps {
  notification: NotificationItem;
}

export const SpaBookingDetail: React.FC<SpaBookingDetailProps> = ({ notification }) => {
  const navigate = useNavigate();
  const {
    booking,
    service,
    facility,
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
  
  const handleCancellation = async () => {
    try {
      await handleCancelBooking(notification.id);
      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la réservation",
        variant: "destructive",
      });
    }
  };
  
  const handleModify = () => {
    navigate(`/spa/booking/${notification.id}`);
  };
  
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
          Détails de votre réservation
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
                {service && <p className="text-sm text-gray-500">{service.name}</p>}
              </div>
            </div>
            <Badge className={getStatusBadgeClass(booking.status)}>
              {getStatusLabel(booking.status)}
            </Badge>
          </div>
          
          {service && (
            <SpaBookingServiceInfo service={service} />
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <SpaBookingDateInfo date={booking.date} time={booking.time} />
            {facility && <SpaBookingFacilityInfo facility={facility} />}
          </div>
          
          <Separator className="my-6" />
          
          <SpaBookingContactInfo booking={booking} />
              
          <Separator className="my-6" />
          
          <div className="flex flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleModify}
            >
              Modifier
            </Button>
            
            {canCancel && (
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleCancellation}
              >
                Annuler
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
