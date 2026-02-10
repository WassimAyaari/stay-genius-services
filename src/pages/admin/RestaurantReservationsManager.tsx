
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useRestaurants } from '@/hooks/useRestaurants';
import { supabase } from '@/integrations/supabase/client';
import { TableReservation } from '@/features/dining/types';
import StatusDialog from '@/components/admin/reservations/StatusDialog';
import ReservationList from '@/components/admin/reservations/ReservationList';
import ErrorState from '@/components/admin/reservations/ErrorState';
import { toast } from 'sonner';
import { useTableReservations } from '@/hooks/useTableReservations';
import { useAdminNotifications } from '@/hooks/admin/useAdminNotifications';

const RestaurantReservationsManager = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchRestaurantById } = useRestaurants();
  const { markSeen } = useAdminNotifications();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear notification badge when viewing reservations
  useEffect(() => {
    markSeen('restaurants');
  }, [markSeen]);
  
  const { 
    reservations, 
    isLoading: isLoadingReservations, 
    updateReservationStatus,
    refetch 
  } = useTableReservations(id);
  
  const [selectedReservation, setSelectedReservation] = useState<TableReservation | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<'pending' | 'confirmed' | 'cancelled'>('pending');
  
  // Fetch restaurant details
  useEffect(() => {
    if (id && id !== ':id') {
      fetchRestaurantById(id)
        .then(data => {
          setRestaurant(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error loading restaurant:", err);
          setError("Unable to load restaurant details. Please check the restaurant ID.");
          setIsLoading(false);
          toast.error("Error loading restaurant");
        });
    } else {
      setError("Invalid restaurant ID. Please select a valid restaurant.");
      setIsLoading(false);
    }
  }, [id, fetchRestaurantById]);
  
  // Function to handle manual refresh
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Reservations refreshed");
    } catch (error) {
      console.error("Error refreshing reservations:", error);
      toast.error("Failed to refresh reservations");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Handle status update
  const handleUpdateStatus = () => {
    if (selectedReservation && newStatus) {
      updateReservationStatus({ 
        id: selectedReservation.id, 
        status: newStatus 
      });
      setIsStatusDialogOpen(false);
    }
  };

  const handleOpenStatusDialog = (reservation: TableReservation) => {
    setSelectedReservation(reservation);
    setNewStatus(reservation.status || 'pending');
    setIsStatusDialogOpen(true);
  };

  // Force refresh on first render
  useEffect(() => {
    handleRefresh();
  }, []);

  if (error) {
    return <ErrorState errorMessage={error} onBackClick={() => navigate('/admin/restaurants')} />;
  }

  if (isLoading || !restaurant) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-gray-500">Loading restaurant reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/restaurants')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-2xl font-semibold ml-4">{restaurant.name} - Reservations</h1>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {isLoadingReservations || isRefreshing ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : reservations && reservations.length > 0 ? (
        <ReservationList 
          reservations={reservations} 
          onOpenStatusDialog={handleOpenStatusDialog} 
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No reservations found for this restaurant</p>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      )}
      
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

export default RestaurantReservationsManager;
