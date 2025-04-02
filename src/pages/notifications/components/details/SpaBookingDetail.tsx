
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Mail, Phone, Home, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSpaBookings } from '@/hooks/useSpaBookings';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { NotificationItem } from '@/types/notification';

interface SpaBookingDetailProps {
  notification: NotificationItem;
}

export const SpaBookingDetail: React.FC<SpaBookingDetailProps> = ({ notification }) => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [facility, setFacility] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const { getBookingById, cancelBooking } = useSpaBookings();
  
  useEffect(() => {
    const loadBookingDetails = async () => {
      if (!notification || !notification.id) return;
      
      setIsLoading(true);
      try {
        const bookingData = await getBookingById(notification.id);
        
        if (!bookingData) {
          toast.error("Réservation introuvable");
          navigate('/notifications');
          return;
        }
        
        setBooking(bookingData);
        
        const { data: serviceData } = await supabase
          .from('spa_services')
          .select('*')
          .eq('id', bookingData.service_id)
          .single();
        
        if (serviceData) {
          setService(serviceData);
          
          const { data: facilityData } = await supabase
            .from('spa_facilities')
            .select('*')
            .eq('id', serviceData.facility_id)
            .single();
          
          setFacility(facilityData);
        }
        
      } catch (error) {
        console.error('Error loading booking details:', error);
        toast.error("Erreur lors du chargement des détails de la réservation");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBookingDetails();
  }, [notification, getBookingById, navigate]);

  const handleCancelBooking = async () => {
    if (!booking || !notification.id) return;
    
    try {
      await cancelBooking(notification.id);
      const updatedBooking = await getBookingById(notification.id);
      setBooking(updatedBooking);
      setIsCancelDialogOpen(false);
      toast.success("Réservation annulée avec succès");
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error("Erreur lors de l'annulation de la réservation");
    }
  };

  const handleViewDetails = () => {
    navigate(`/spa/booking/${notification.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'completed': return 'Complétée';
      case 'cancelled': return 'Annulée';
      case 'in_progress': return 'En cours';
      default: return 'En attente';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!booking || !service) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-lg font-medium text-gray-600">
            Impossible de trouver les détails de cette réservation.
          </p>
          <Button 
            onClick={handleViewDetails} 
            className="mt-4"
          >
            Voir les détails complets
          </Button>
        </CardContent>
      </Card>
    );
  }

  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';
  const formattedDate = booking.date ? format(parseISO(booking.date), 'PPPP', { locale: fr }) : 'Date inconnue';

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Détails de la réservation</CardTitle>
          <Badge className={getStatusColor(booking.status)}>
            {getStatusText(booking.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg">{service.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                {service.duration}
              </div>
              <span className="font-semibold">${service.price}</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium">Détails de l'installation</h3>
              {facility && (
                <>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{facility.name}</p>
                      <p className="text-gray-600">{facility.location}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Détails de la réservation</h3>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Date et heure</p>
                  <p className="text-gray-600">{formattedDate} à {booking.time}</p>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="font-medium">Informations de contact</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Nom</p>
                  <p className="text-gray-600">{booking.guest_name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">{booking.guest_email}</p>
                </div>
              </div>
              
              {booking.guest_phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-gray-600">{booking.guest_phone}</p>
                  </div>
                </div>
              )}
              
              {booking.room_number && (
                <div className="flex items-center gap-2 text-sm">
                  <Home className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Chambre</p>
                    <p className="text-gray-600">{booking.room_number}</p>
                  </div>
                </div>
              )}
            </div>
            
            {booking.special_requests && (
              <div className="flex items-start gap-2 text-sm mt-4">
                <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Demandes spéciales</p>
                  <p className="text-gray-600">{booking.special_requests}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={handleViewDetails}
            >
              Voir les détails complets
            </Button>
            
            {canCancel && (
              <Button
                variant="destructive"
                onClick={() => setIsCancelDialogOpen(true)}
              >
                Annuler la réservation
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la réservation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler cette réservation ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelBooking}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmer l'annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
