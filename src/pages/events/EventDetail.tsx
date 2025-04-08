
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import EventBookingButton from '@/features/events/components/EventBookingButton';
import { Event } from '@/types/event';
import { toast } from 'sonner';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!id) {
          toast.error("ID d'événement manquant");
          navigate('/events');
          return;
        }

        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          toast.error("Événement introuvable");
          navigate('/events');
          return;
        }

        setEvent(data as Event);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'événement:", error);
        toast.error("Erreur lors du chargement de l'événement");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleReservationSuccess = () => {
    toast.success("Réservation effectuée avec succès!");
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-64 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div>
              <Skeleton className="h-[200px] w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <p>Événement introuvable.</p>
          <Button onClick={handleBack} className="mt-4">
            Retour
          </Button>
        </div>
      </Layout>
    );
  }

  const formattedDate = event.date ? format(parseISO(event.date), 'EEEE d MMMM yyyy', { locale: fr }) : 'Date non spécifiée';

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <Button variant="outline" onClick={handleBack}>
            Retour
          </Button>
        </div>

        <div className="mb-6 rounded-lg overflow-hidden h-64 bg-gray-200">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">À propos de l'événement</h2>
            <p className="text-gray-700 mb-6">{event.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </Badge>

              {event.time && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {event.time}
                </Badge>
              )}

              {event.location && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </Badge>
              )}
            </div>
            
            <div>
              <EventBookingButton 
                event={event} 
                onSuccess={handleReservationSuccess} 
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Détails</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-sm text-gray-600">{formattedDate}</p>
                    </div>
                  </div>

                  {event.time && (
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <p className="font-medium">Heure</p>
                        <p className="text-sm text-gray-600">{event.time}</p>
                      </div>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <p className="font-medium">Lieu</p>
                        <p className="text-sm text-gray-600">{event.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start">
                    <Badge>{event.category === 'event' ? 'Événement' : 'Promotion'}</Badge>
                  </div>
                </div>
                
                <hr className="my-4" />
                
                <EventBookingButton 
                  event={event} 
                  onSuccess={handleReservationSuccess} 
                  className="w-full mt-2"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetail;
