
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useTableReservations } from '@/hooks/useTableReservations';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import StatusDialog from '@/components/admin/reservations/StatusDialog';
import ReservationList from '@/components/admin/reservations/ReservationList';
import ErrorState from '@/components/admin/reservations/ErrorState';
import { toast } from 'sonner';

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

  if (loadingError) {
    return <ErrorState errorMessage={loadingError} onBackClick={() => navigate('/admin/restaurants')} />;
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

      <ReservationList 
        reservations={reservations} 
        onOpenStatusDialog={handleOpenStatusDialog} 
      />
      
      <StatusDialog 
        isOpen={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        reservation={selectedReservation}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default ReservationManager;
