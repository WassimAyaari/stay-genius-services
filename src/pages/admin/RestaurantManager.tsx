
import React, { useState } from 'react';
import { useRestaurants } from '@/hooks/useRestaurants';
import { Restaurant } from '@/features/dining/types';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Edit, Trash2, Menu, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const RestaurantManager = () => {
  const { restaurants, isLoading, createRestaurant, updateRestaurant, deleteRestaurant } = useRestaurants();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const navigate = useNavigate();
  
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      cuisine: '',
      openHours: '',
      location: '',
      status: 'open',
      images: [''] // at least one image URL is required
    }
  });

  // Update form when editing a restaurant
  React.useEffect(() => {
    if (editingRestaurant) {
      form.reset({
        name: editingRestaurant.name,
        description: editingRestaurant.description,
        cuisine: editingRestaurant.cuisine,
        openHours: editingRestaurant.openHours,
        location: editingRestaurant.location,
        status: editingRestaurant.status,
        images: editingRestaurant.images.length > 0 ? editingRestaurant.images : ['']
      });
    }
  }, [editingRestaurant, form]);

  const handleAddRestaurant = () => {
    setEditingRestaurant(null);
    form.reset({
      name: '',
      description: '',
      cuisine: '',
      openHours: '',
      location: '',
      status: 'open',
      images: ['']
    });
    setIsDialogOpen(true);
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setIsDialogOpen(true);
  };

  const handleDeleteRestaurant = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ?')) {
      deleteRestaurant(id);
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    const filteredImages = data.images.filter(img => img.trim() !== '');
    
    if (filteredImages.length === 0) {
      toast.error('Au moins une image est requise');
      return;
    }
    
    const restaurantData = {
      ...data,
      images: filteredImages
    };
    
    if (editingRestaurant) {
      updateRestaurant({ id: editingRestaurant.id, ...restaurantData });
    } else {
      createRestaurant(restaurantData);
    }
    
    setIsDialogOpen(false);
  });

  const handleAddImageField = () => {
    const images = form.getValues('images');
    form.setValue('images', [...images, '']);
  };

  const handleRemoveImageField = (index: number) => {
    const images = form.getValues('images');
    if (images.length > 1) {
      form.setValue('images', images.filter((_, i) => i !== index));
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Chargement des restaurants...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Gestion des Restaurants</h1>
        <Button onClick={handleAddRestaurant}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un Restaurant
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants?.map((restaurant) => (
          <Card key={restaurant.id} className="overflow-hidden">
            <div className="relative aspect-video">
              <img 
                src={restaurant.images[0]} 
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${restaurant.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                `}>
                  {restaurant.status}
                </span>
              </div>
            </div>
            <CardHeader>
              <CardTitle>{restaurant.name}</CardTitle>
              <CardDescription>{restaurant.cuisine}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{restaurant.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => handleEditRestaurant(restaurant)}>
                  <Edit className="mr-2 h-4 w-4" /> Modifier
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate(`/admin/restaurants/${restaurant.id}/menu`)}>
                  <Menu className="mr-2 h-4 w-4" /> Menu
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate(`/admin/restaurants/${restaurant.id}/reservations`)}>
                  <Calendar className="mr-2 h-4 w-4" /> Réservations
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteRestaurant(restaurant.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingRestaurant ? 'Modifier le Restaurant' : 'Ajouter un Restaurant'}</DialogTitle>
            <DialogDescription>
              {editingRestaurant 
                ? 'Modifiez les détails du restaurant ci-dessous.' 
                : 'Entrez les détails du nouveau restaurant.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom du restaurant" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cuisine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuisine</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Type de cuisine" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Description" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emplacement</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Emplacement dans l'hôtel" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="openHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heures d'ouverture</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Heures d'ouverture" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open">Ouvert</SelectItem>
                        <SelectItem value="closed">Fermé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <FormLabel>Images</FormLabel>
                {form.watch('images').map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`images.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} placeholder="URL de l'image" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleRemoveImageField(index)}
                      disabled={form.watch('images').length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddImageField}
                >
                  Ajouter une image
                </Button>
              </div>
              
              <DialogFooter>
                <Button type="submit">
                  {editingRestaurant ? 'Enregistrer' : 'Ajouter'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantManager;
