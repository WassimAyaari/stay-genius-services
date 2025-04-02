
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useRestaurants } from '@/hooks/useRestaurants';
import { RestaurantTable } from '@/components/admin/restaurants/RestaurantTable';
import { RestaurantFormDialog } from '@/components/admin/restaurants/RestaurantFormDialog';
import { toast } from 'sonner';

const RestaurantManager = () => {
  const navigate = useNavigate();
  const { restaurants, isLoading, refetch, deleteRestaurant } = useRestaurants();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Force refresh on first render
  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing restaurants:', error);
      toast.error('Failed to refresh restaurants');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEditRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDialogOpen(true);
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      await deleteRestaurant(id);
      toast.success('Restaurant deleted successfully');
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      toast.error('Failed to delete restaurant');
    }
  };

  const handleDialogClose = (success = false) => {
    setIsDialogOpen(false);
    setSelectedRestaurant(null);
    if (success) {
      refetch();
    }
  };

  const navigateToReservations = (restaurantId) => {
    navigate(`/admin/restaurants/${restaurantId}/reservations`);
  };

  const navigateToMenus = (restaurantId) => {
    navigate(`/admin/restaurant-menus?restaurantId=${restaurantId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Restaurant Management</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Restaurant
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Restaurants</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || isRefreshing ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <RestaurantTable 
              restaurants={restaurants || []} 
              onEdit={handleEditRestaurant}
              onDelete={handleDeleteRestaurant}
              onViewReservations={navigateToReservations}
              onViewMenus={navigateToMenus}
            />
          )}
        </CardContent>
      </Card>

      <RestaurantFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onClose={handleDialogClose}
        restaurant={selectedRestaurant}
      />
    </div>
  );
};

export default RestaurantManager;
