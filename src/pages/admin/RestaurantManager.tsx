
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRestaurants } from '@/hooks/useRestaurants';
import { Restaurant } from '@/features/dining/types';
import { Plus } from 'lucide-react';
import RestaurantFormDialog from '@/components/admin/restaurants/RestaurantFormDialog';
import RestaurantTable from '@/components/admin/restaurants/RestaurantTable';

type FormValues = {
  name: string;
  description: string;
  cuisine: string;
  openHours: string;
  location: string;
  status: 'open' | 'closed';
  images: string[];
};

const RestaurantManager: React.FC = () => {
  const { toast } = useToast();
  const { restaurants, isLoading, error, updateRestaurant, createRestaurant, deleteRestaurant } = useRestaurants();
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    try {
      if (editingRestaurant) {
        await updateRestaurant({
          ...editingRestaurant,
          name: values.name,
          description: values.description,
          cuisine: values.cuisine,
          openHours: values.openHours,
          location: values.location,
          status: values.status,
          images: values.images,
        });
        toast({
          title: "Restaurant updated",
          description: "The restaurant has been updated successfully.",
        });
      } else {
        await createRestaurant({
          name: values.name,
          description: values.description,
          cuisine: values.cuisine,
          openHours: values.openHours,
          location: values.location,
          status: values.status,
          images: values.images,
        });
        toast({
          title: "Restaurant added",
          description: "The restaurant has been added successfully.",
        });
      }
      setIsDialogOpen(false);
      setEditingRestaurant(null);
    } catch (error) {
      console.error("Error saving restaurant:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem saving the restaurant.",
      });
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRestaurant(id);
      toast({
        title: "Restaurant deleted",
        description: "The restaurant has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem deleting the restaurant.",
      });
    }
  };

  const handleDialogOpen = () => {
    setEditingRestaurant(null);
    setIsDialogOpen(true);
  };

  if (isLoading) return <div className="p-8 text-center">Loading restaurants...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error loading restaurants: {error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Restaurant Manager</h1>
        <Button variant="default" onClick={handleDialogOpen}>
          <Plus className="mr-2 h-4 w-4" /> Add Restaurant
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Restaurants</CardTitle>
          <CardDescription>Manage your hotel's restaurants.</CardDescription>
        </CardHeader>
        <CardContent>
          <RestaurantTable 
            restaurants={restaurants} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </CardContent>
      </Card>

      <RestaurantFormDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingRestaurant={editingRestaurant}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default RestaurantManager;
