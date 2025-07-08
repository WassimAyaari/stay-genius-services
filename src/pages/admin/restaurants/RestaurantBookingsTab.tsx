import React from 'react';
import { useTableReservations } from '@/hooks/useTableReservations';
import { useRestaurants } from '@/hooks/useRestaurants';
import ReservationList from '@/components/admin/reservations/ReservationList';
import StatusDialog from '@/components/admin/reservations/StatusDialog';
import { TableReservation } from '@/features/dining/types';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const RestaurantBookingsTab = () => {
  const [selectedRestaurantId, setSelectedRestaurantId] = React.useState<string | undefined>();
  const [selectedReservation, setSelectedReservation] = React.useState<TableReservation | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState<'pending' | 'confirmed' | 'cancelled'>('pending');

  const { restaurants } = useRestaurants();
  const { 
    reservations, 
    isLoading: isLoadingReservations, 
    updateReservationStatus,
    refetch 
  } = useTableReservations(selectedRestaurantId);

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Reservations refreshed");
    } catch (error) {
      console.error("Error refreshing reservations:", error);
      toast.error("Failed to refresh reservations");
    }
  };

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

  const selectedRestaurant = restaurants?.find(r => r.id === selectedRestaurantId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Select value={selectedRestaurantId} onValueChange={setSelectedRestaurantId}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a restaurant" />
            </SelectTrigger>
            <SelectContent>
              {restaurants?.map((restaurant) => (
                <SelectItem key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedRestaurantId && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoadingReservations}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingReservations ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>

      {!selectedRestaurantId ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please select a restaurant to view its reservations</p>
        </div>
      ) : isLoadingReservations ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : reservations && reservations.length > 0 ? (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">{selectedRestaurant?.name} - Reservations</h3>
          </div>
          <ReservationList 
            reservations={reservations} 
            onOpenStatusDialog={handleOpenStatusDialog} 
          />
        </div>
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

export default RestaurantBookingsTab;