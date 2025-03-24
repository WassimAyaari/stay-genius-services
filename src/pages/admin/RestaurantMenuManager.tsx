
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useRestaurantMenus } from '@/hooks/useRestaurantMenus';
import { MenuItem } from '@/features/dining/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CATEGORIES = [
  'Entrée',
  'Plat Principal',
  'Dessert',
  'Boisson',
  'Petit-déjeuner',
  'Déjeuner',
  'Dîner',
  'Spécialité',
  'Végétarien',
  'Vegan',
  'Sans Gluten'
];

const RestaurantMenuManager = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchRestaurantById } = useRestaurants();
  const { menuItems, isLoading, createMenuItem, updateMenuItem, deleteMenuItem } = useRestaurantMenus(id);
  
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      isFeatured: false,
      status: 'available'
    }
  });

  useEffect(() => {
    if (id) {
      fetchRestaurantById(id)
        .then(data => setRestaurant(data))
        .catch(err => console.error("Erreur lors du chargement du restaurant:", err));
    }
  }, [id, fetchRestaurantById]);

  // Update form when editing a menu item
  React.useEffect(() => {
    if (editingMenuItem) {
      form.reset({
        name: editingMenuItem.name,
        description: editingMenuItem.description,
        price: editingMenuItem.price,
        category: editingMenuItem.category,
        image: editingMenuItem.image || '',
        isFeatured: editingMenuItem.isFeatured,
        status: editingMenuItem.status
      });
    }
  }, [editingMenuItem, form]);

  const handleAddMenuItem = () => {
    setEditingMenuItem(null);
    form.reset({
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      isFeatured: false,
      status: 'available'
    });
    setIsDialogOpen(true);
  };

  const handleEditMenuItem = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
    setIsDialogOpen(true);
  };

  const handleDeleteMenuItem = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plat du menu ?')) {
      deleteMenuItem(id);
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (editingMenuItem) {
      updateMenuItem({ 
        id: editingMenuItem.id, 
        restaurantId: id!, 
        ...data 
      });
    } else {
      createMenuItem({ 
        restaurantId: id!, 
        ...data 
      });
    }
    
    setIsDialogOpen(false);
  });

  if (isLoading || !restaurant) {
    return <div className="p-8 text-center">Chargement du menu...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/restaurants')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">{restaurant.name}</h1>
          <p className="text-gray-600">Gestion du Menu</p>
        </div>
        <Button onClick={handleAddMenuItem}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un Plat
        </Button>
      </div>

      {menuItems?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Aucun plat dans le menu</p>
          <Button onClick={handleAddMenuItem}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un Plat
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems?.map((menuItem) => (
            <Card key={menuItem.id} className="overflow-hidden">
              {menuItem.image && (
                <div className="relative aspect-video">
                  <img 
                    src={menuItem.image} 
                    alt={menuItem.name}
                    className="w-full h-full object-cover"
                  />
                  {menuItem.isFeatured && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Recommandé
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${menuItem.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    `}>
                      {menuItem.status === 'available' ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle>{menuItem.name}</CardTitle>
                <CardDescription>{menuItem.category} - {menuItem.price} €</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{menuItem.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => handleEditMenuItem(menuItem)}>
                    <Edit className="mr-2 h-4 w-4" /> Modifier
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteMenuItem(menuItem.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingMenuItem ? 'Modifier le Plat' : 'Ajouter un Plat'}</DialogTitle>
            <DialogDescription>
              {editingMenuItem 
                ? 'Modifiez les détails du plat ci-dessous.' 
                : 'Entrez les détails du nouveau plat.'}
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
                      <Input {...field} placeholder="Nom du plat" required />
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        min="0"
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        placeholder="Prix" 
                        required 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="URL de l'image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Recommandé</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Mettre en avant ce plat comme recommandé
                      </p>
                    </div>
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
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Disponible</SelectItem>
                        <SelectItem value="unavailable">Indisponible</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">
                  {editingMenuItem ? 'Enregistrer' : 'Ajouter'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantMenuManager;
