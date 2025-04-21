
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, CalendarPlus } from 'lucide-react';
import { useRestaurants } from '@/hooks/useRestaurants';
import { RestaurantTable } from '@/components/admin/restaurants/RestaurantTable';
import RestaurantFormDialog from '@/components/admin/restaurants/RestaurantFormDialog';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
// Add import for Dialog/EventForm
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EventForm from '@/pages/admin/components/events/EventForm';
import { useEvents } from '@/hooks/useEvents';

const RestaurantManager = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { restaurants, isLoading, deleteRestaurant } = useRestaurants();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State for add event dialog
  const [addEventRestaurantId, setAddEventRestaurantId] = useState<string|null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  const { createEvent } = useEvents();

  // Force refresh on first render
  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['restaurants'] });
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
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    }
  };

  const navigateToReservations = (restaurantId) => {
    navigate(`/admin/restaurants/${restaurantId}/reservations`);
  };

  const navigateToMenus = (restaurantId) => {
    navigate(`/admin/restaurant-menus?restaurantId=${restaurantId}`);
  };

  // Handle add event
  const handleAddEvent = (restaurant) => {
    setAddEventRestaurantId(restaurant.id);
    setIsAddEventOpen(true);
  };

  // On event submit, create event and close dialog
  const handleEventSubmit = async (data) => {
    await createEvent({ ...data, restaurant_id: addEventRestaurantId });
    setIsAddEventOpen(false);
    setAddEventRestaurantId(null);
    toast.success('Event created and linked to restaurant!');
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
              onAddEvent={handleAddEvent}
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

      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Event to Restaurant</DialogTitle>
          </DialogHeader>
          <EventForm
            // Send restaurant_id so form is prefilled and locked
            initialData={{ restaurant_id: addEventRestaurantId }}
            onSubmit={handleEventSubmit}
            onCancel={() => setIsAddEventOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantManager;

