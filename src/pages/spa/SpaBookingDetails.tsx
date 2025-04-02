import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, MapPin, User, Mail, Phone, Home, FileText, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import Layout from '@/components/Layout';
import { useSpaBookings } from '@/hooks/useSpaBookings';
import { supabase } from '@/integrations/supabase/client';
import BookingDialog from '@/features/spa/components/SpaBookingDialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

const SpaBookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState<any>(null);
  const [facility, setFacility] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const { getBookingById, updateBookingStatus, cancelBooking } = useSpaBookings();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    const loadBooking = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const bookingData = await getBookingById(id);
        
        if (!bookingData) {
          toast.error("Réservation introuvable");
          navigate('/profile');
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
    
    loadBooking();
  }, [id, getBookingById, navigate]);

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleCancelBooking = async () => {
    if (!booking || !id) return;
    
    try {
      await cancelBooking(id);
      const updatedBooking = await getBookingById(id);
      setBooking(updatedBooking);
      setIsCancelDialogOpen(false);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error("Erreur lors de l'annulation de la réservation");
    }
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

  const canCancel = booking?.status === 'pending' || booking?.status === 'confirmed';
  const canEdit = booking?.status === 'pending';

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-4xl py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!booking || !service) {
    return (
      <Layout>
        <div className="container max-w-4xl py-8">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Réservation introuvable</h3>
              <p className="text-gray-500 mb-4">
                La réservation que vous recherchez n'existe pas ou a été supprimée.
              </p>
              <Button onClick={() => navigate('/profile')}>
                Retour au profil
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const formattedDate = format(parseISO(booking.date), 'PPPP', { locale: fr });

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Détails de votre réservation</CardTitle>
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
                      {facility.opening_hours && (
                        <div className="flex items-start gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Heures d'ouverture</p>
                            <p className="text-gray-600">{facility.opening_hours}</p>
                          </div>
                        </div>
                      )}
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
              
              {(canEdit || canCancel) && (
                <div className="flex justify-end gap-4 pt-4">
                  {canEdit && (
                    <Button variant="outline" onClick={handleEdit}>
                      Modifier
                    </Button>
                  )}
                  
                  {canCancel && (
                    <Button
                      variant="destructive"
                      onClick={() => setIsCancelDialogOpen(true)}
                    >
                      Annuler
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {isEditDialogOpen && (
          <BookingDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            serviceId={service.id}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              navigate(0);
            }}
            existingBooking={booking}
          />
        )}
        
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
      </div>
    </Layout>
  );
};

export default SpaBookingDetails;
