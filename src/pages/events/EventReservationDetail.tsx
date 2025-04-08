
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Users, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEventReservations } from '@/hooks/useEventReservations';
import { EventReservation } from '@/features/events/types';
import Layout from '@/components/Layout';

const EventReservationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReservationDetails, updateReservationStatus, loading: loadingReservation } = useEventReservations();
  const [reservation, setReservation] = useState<EventReservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        if (!id) {
          setError('Identifiant de réservation manquant');
          setLoading(false);
          return;
        }

        const data = await getReservationDetails(id);
        setReservation(data);
      } catch (err) {
        console.error('Erreur lors du chargement des détails de la réservation:', err);
        setError('Impossible de charger les détails de la réservation');
      } finally {
        setLoading(false);
      }
    };

    fetchReservationDetails();
  }, [id, getReservationDetails]);

  const handleCancelReservation = async () => {
    try {
      if (!id) return;
      
      await updateReservationStatus(id, 'cancelled');
      // Mettre à jour les données locales après l'annulation
      setReservation(prev => prev ? { ...prev, status: 'cancelled' } : null);
    } catch (err) {
      console.error('Erreur lors de l\'annulation de la réservation:', err);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'cancelled': return 'Annulée';
      default: return 'En attente';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-64 mb-4" />
          <Skeleton className="h-32" />
        </div>
      </Layout>
    );
  }

  if (error || !reservation) {
    return (
      <Layout>
        <div className="container py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Réservation introuvable'}
            </AlertDescription>
          </Alert>
          <Button onClick={handleBack} className="mt-4">
            Retour
          </Button>
        </div>
      </Layout>
    );
  }

  const formattedDate = reservation.date && format(new Date(reservation.date), 'EEEE d MMMM yyyy', { locale: fr });
  const eventTitle = reservation.event?.title || 'Événement';
  const eventDescription = reservation.event?.description || '';
  const eventImage = reservation.event?.image || '';
  const eventLocation = reservation.event?.location || 'Lieu non spécifié';

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Détails de la réservation</h1>
          <Button variant="outline" onClick={handleBack}>
            Retour
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{eventTitle}</CardTitle>
                <CardDescription>
                  Réservation #{reservation.id.substring(0, 8)}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(reservation.status)}>
                {getStatusText(reservation.status)}
              </Badge>
            </div>
          </CardHeader>

          {reservation.event && (
            <CardContent className="pb-2">
              <div className="flex items-start mb-4">
                <div className="w-24 h-24 rounded-md overflow-hidden mr-4 flex-shrink-0">
                  <img 
                    src={eventImage} 
                    alt={eventTitle} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">{eventDescription}</p>
                  
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{eventLocation}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          )}

          <CardContent className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm text-gray-500 mb-2">Détails de la réservation</h3>
                
                <div className="flex items-center mb-2">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{formattedDate}</span>
                </div>
                
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{reservation.guests} {reservation.guests > 1 ? 'participants' : 'participant'}</span>
                </div>
                
                {reservation.specialRequests && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm">Demandes spéciales:</h4>
                    <p className="text-sm mt-1">{reservation.specialRequests}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-500 mb-2">Informations de contact</h3>
                <p className="mb-1">{reservation.guestName}</p>
                <p className="mb-1">{reservation.guestEmail}</p>
                {reservation.guestPhone && <p className="mb-1">{reservation.guestPhone}</p>}
                {reservation.roomNumber && <p>Chambre: {reservation.roomNumber}</p>}
              </div>
            </div>
          </CardContent>
          
          {reservation.status !== 'cancelled' && (
            <CardFooter className="flex justify-end border-t pt-4">
              <Button 
                variant="destructive" 
                onClick={handleCancelReservation} 
                disabled={loadingReservation}
              >
                Annuler la réservation
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default EventReservationDetail;
