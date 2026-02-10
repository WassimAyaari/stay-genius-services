import React from 'react';
import { useAllTableReservations } from '@/hooks/useAllTableReservations';
import { useRestaurants } from '@/hooks/useRestaurants';
import ReservationList from '@/components/admin/reservations/ReservationList';
import StatusDialog from '@/components/admin/reservations/StatusDialog';
import { TableReservation } from '@/features/dining/types';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RestaurantBookingsTab = () => {
  const [selectedRestaurantId, setSelectedRestaurantId] = React.useState<string>('all');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');
  const [selectedReservation, setSelectedReservation] = React.useState<TableReservation | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState<'pending' | 'confirmed' | 'cancelled'>('pending');

  const { restaurants } = useRestaurants();
  const { 
    reservations, 
    isLoading, 
    updateReservationStatus,
    refetch 
  } = useAllTableReservations({
    restaurantId: selectedRestaurantId === 'all' ? undefined : selectedRestaurantId,
    status: selectedStatus === 'all' ? undefined : selectedStatus,
  });

  // Build a map of restaurant id -> name
  const restaurantMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    restaurants?.forEach(r => { map[r.id] = r.name; });
    return map;
  }, [restaurants]);

  const handleUpdateStatus = () => {
    if (selectedReservation && newStatus) {
      updateReservationStatus({ id: selectedReservation.id, status: newStatus });
      setIsStatusDialogOpen(false);
    }
  };

  const handleOpenStatusDialog = (reservation: TableReservation) => {
    setSelectedReservation(reservation);
    setNewStatus(reservation.status || 'pending');
    setIsStatusDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={selectedRestaurantId} onValueChange={setSelectedRestaurantId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Tous les restaurants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les restaurants</SelectItem>
              {restaurants?.map((restaurant) => (
                <SelectItem key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmée</SelectItem>
              <SelectItem value="cancelled">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Rafraîchir
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : reservations.length > 0 ? (
        <ReservationList 
          reservations={reservations} 
          onOpenStatusDialog={handleOpenStatusDialog}
          restaurantMap={restaurantMap}
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucune réservation trouvée</p>
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
