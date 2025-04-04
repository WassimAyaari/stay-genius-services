
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NotificationItem } from '@/types/notification';
import { Badge } from '@/components/ui/badge';
import { ShowerHead, Calendar, Clock, Home, CheckCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSpaBookingDetail } from './useSpaBookingDetail';
import { SpaBookingLoader } from './SpaBookingLoader';
import { SpaBookingNotFound } from './SpaBookingNotFound';

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

  if (isLoading) {
    return <SpaBookingLoader />;
  }

  if (error || !booking) {
    return (
      <SpaBookingNotFound 
        onViewDetails={handleViewDetails} 
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
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-2 rounded-full mr-3">
            <ShowerHead className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium">Réservation de spa</h2>
            <p className="text-sm text-gray-500">Service bien-être</p>
          </div>
        </div>
        <Badge className={getStatusBadgeClass(booking.status)}>
          {getStatusLabel(booking.status)}
        </Badge>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
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
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span>Date: {formattedDate}</span>
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
          
          <div className="text-sm text-gray-500">
            {booking.created_at ? 
              `Réservation créée le ${format(new Date(booking.created_at), 'dd/MM/yyyy')}` : 
              'Réservation récente'}
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
          
          {booking.status === 'completed' && (
            <Alert className="bg-green-50 border-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Réservation complétée</AlertTitle>
              <AlertDescription className="text-green-700">
                Votre réservation a été réalisée avec succès.
              </AlertDescription>
            </Alert>
          )}
          
          <Separator />
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={handleViewDetails}
            >
              Voir les détails complets
            </Button>
            
            {canCancel && (
              <Button
                variant="destructive"
                onClick={() => handleCancelBooking(notification.id)}
              >
                Annuler la réservation
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
