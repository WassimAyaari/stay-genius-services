import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, Users, Hash, MessageSquare, CalendarX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Layout from '@/components/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { useEventReservationDetail } from '@/hooks/useEventReservationDetail';
import { toast } from 'sonner';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);
  const { reservation, isLoading, error, cancelReservation } = useEventReservationDetail(id || '');

  const handleCancelReservation = async () => {
    if (isCancelling) return;
    
    try {
      setIsCancelling(true);
      console.log("Starting cancellation for reservation ID:", id);
      await cancelReservation();
      console.log("Cancellation completed successfully");
      toast.success("La réservation a été annulée avec succès");
    } catch (error) {
      console.error("Error during reservation cancellation:", error);
      toast.error("Une erreur s'est produite lors de l'annulation de la réservation");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return <EventDetailSkeleton />;
  }

  if (error || !reservation) {
    return (
      <Layout>
        <div className="container py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-red-500">Erreur</CardTitle>
              <CardDescription>
                La réservation n'a pas pu être trouvée ou une erreur s'est produite.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate(-1)}>Retour</Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'cancelled':
        return 'Annulée';
      default:
        return 'En attente';
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            ← Retour
          </Button>
          
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>Détails de la réservation</CardTitle>
                  <CardDescription>
                    Événement: {reservation.event?.title || 'Événement'}
                  </CardDescription>
                </div>
                <Badge className={`${getStatusColor(reservation.status)}`}>
                  {getStatusText(reservation.status)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Event Details */}
              {reservation.event && (
                <div>
                  <h3 className="text-lg font-medium">Détails de l'événement</h3>
                  <Separator className="my-2" />
                  <div className="space-y-2">
                    <p className="text-sm">{reservation.event.description}</p>
                    {reservation.event.location && (
                      <p className="text-sm text-muted-foreground">
                        Lieu: {reservation.event.location}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Reservation Info */}
              <div>
                <h3 className="text-lg font-medium">Informations de réservation</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm">Date: {formatDate(reservation.date)}</span>
                  </div>
                  {reservation.event?.time && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm">Heure: {reservation.event.time}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm">Nombre de personnes: {reservation.guests}</span>
                  </div>
                  {reservation.roomNumber && (
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-primary" />
                      <span className="text-sm">Chambre: {reservation.roomNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-medium">Informations de contact</h3>
                <Separator className="my-2" />
                <div className="space-y-2">
                  <p className="text-sm">Nom: {reservation.guestName}</p>
                  {reservation.guestEmail && (
                    <p className="text-sm">Email: {reservation.guestEmail}</p>
                  )}
                  {reservation.guestPhone && (
                    <p className="text-sm">Téléphone: {reservation.guestPhone}</p>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              {reservation.specialRequests && (
                <div>
                  <h3 className="text-lg font-medium">Demandes spéciales</h3>
                  <Separator className="my-2" />
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex gap-2">
                      <MessageSquare className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                      <p className="text-sm">{reservation.specialRequests}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
              {reservation.status !== 'cancelled' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full sm:w-auto"
                      disabled={isCancelling}
                    >
                      <CalendarX className="mr-2 h-4 w-4" />
                      {isCancelling ? "Annulation en cours..." : "Annuler la réservation"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Êtes-vous sûr de vouloir annuler cette réservation?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action ne peut pas être annulée. La réservation sera définitivement
                        annulée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancelReservation}>
                        Oui, annuler la réservation
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

const EventDetailSkeleton = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-10 w-24 mb-4" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-px w-full my-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div>
                <Skeleton className="h-6 w-64 mb-2" />
                <Skeleton className="h-px w-full my-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-px w-full my-2" />
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-4 w-64 mb-2" />
                <Skeleton className="h-4 w-52" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-48" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetail;
