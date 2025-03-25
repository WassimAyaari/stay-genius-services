
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useTableReservations } from '@/hooks/useTableReservations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Calendar,
  Clock,
  Users,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock3,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ReservationManager = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchRestaurantById } = useRestaurants();
  const { reservations, isLoading, error, updateReservationStatus } = useTableReservations(id);
  
  const [restaurant, setRestaurant] = useState<any>(null);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<'pending' | 'confirmed' | 'cancelled'>('pending');
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  useEffect(() => {
    if (id && id !== ':id') {
      fetchRestaurantById(id)
        .then(data => setRestaurant(data))
        .catch(err => {
          console.error("Erreur lors du chargement du restaurant:", err);
          setLoadingError("Impossible de charger le restaurant. Veuillez vérifier l'identifiant.");
          toast.error("Erreur lors du chargement du restaurant");
        });
    } else {
      setLoadingError("ID de restaurant invalide. Veuillez sélectionner un restaurant valide.");
    }
  }, [id, fetchRestaurantById]);

  const handleUpdateStatus = () => {
    if (selectedReservation && newStatus) {
      updateReservationStatus({ 
        id: selectedReservation.id, 
        status: newStatus 
      });
      setIsStatusDialogOpen(false);
    }
  };

  const handleOpenStatusDialog = (reservation: any) => {
    setSelectedReservation(reservation);
    setNewStatus(reservation.status);
    setIsStatusDialogOpen(true);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      return dateStr;
    }
  };

  const getStatusBadgeClasses = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock3 className="h-4 w-4 text-yellow-600" />;
    }
  };

  if (loadingError) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center mb-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/restaurants')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
        </div>
        
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{loadingError}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading || !restaurant) {
    return <div className="p-8 text-center">Chargement des réservations...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/restaurants')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
      </div>
      
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">{restaurant.name}</h1>
        <p className="text-gray-600">Gestion des Réservations</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>Impossible de charger les réservations: {error.message}</AlertDescription>
        </Alert>
      )}

      {reservations?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Aucune réservation pour ce restaurant</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations?.map((reservation) => (
            <Card key={reservation.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>
                    {reservation.guestName || 'Client'}
                  </CardTitle>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusBadgeClasses(reservation.status)}`}>
                    {getStatusIcon(reservation.status)}
                    {getStatusText(reservation.status)}
                  </div>
                </div>
                <CardDescription>
                  Réservation #{reservation.id.substring(0, 8)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{formatDate(reservation.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{reservation.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{reservation.guests} personnes</span>
                </div>
                {reservation.specialRequests && (
                  <div className="flex items-start gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="flex-1">{reservation.specialRequests}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Informations de contact:</p>
                  {reservation.guestEmail && (
                    <p className="text-sm text-gray-600">Email: {reservation.guestEmail}</p>
                  )}
                  {reservation.guestPhone && (
                    <p className="text-sm text-gray-600">Téléphone: {reservation.guestPhone}</p>
                  )}
                </div>
                
                <Button
                  onClick={() => handleOpenStatusDialog(reservation)}
                  className="w-full"
                  variant="outline"
                >
                  Modifier le statut
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier le statut de la réservation</DialogTitle>
            <DialogDescription>
              Changer le statut de la réservation pour {selectedReservation?.guestName || 'ce client'}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select 
              value={newStatus} 
              onValueChange={(value: any) => setNewStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button onClick={handleUpdateStatus}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReservationManager;
