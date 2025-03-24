
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MenuItem } from '@/features/dining/types';
import { toast } from 'sonner';

export const useRestaurantMenus = (restaurantId?: string) => {
  const queryClient = useQueryClient();

  const fetchMenuItems = async (): Promise<MenuItem[]> => {
    let query = supabase
      .from('restaurant_menus')
      .select('*')
      .order('category');
    
    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }

    // Convert from snake_case to camelCase
    return data.map(item => ({
      id: item.id,
      restaurantId: item.restaurant_id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      category: item.category,
      image: item.image,
      isFeatured: item.is_featured,
      status: item.status as 'available' | 'unavailable'
    }));
  };

  const fetchMenuItemById = async (id: string): Promise<MenuItem> => {
    const { data, error } = await supabase
      .from('restaurant_menus')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching menu item with id ${id}:`, error);
      throw error;
    }

    // Convert from snake_case to camelCase
    return {
      id: data.id,
      restaurantId: data.restaurant_id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      image: data.image,
      isFeatured: data.is_featured,
      status: data.status as 'available' | 'unavailable'
    };
  };

  const createMenuItem = async (menuItem: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    // Convert from camelCase to snake_case
    const { data, error } = await supabase
      .from('restaurant_menus')
      .insert({
        restaurant_id: menuItem.restaurantId,
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        category: menuItem.category,
        image: menuItem.image,
        is_featured: menuItem.isFeatured,
        status: menuItem.status
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }

    // Convert from snake_case to camelCase for the returned data
    return {
      id: data.id,
      restaurantId: data.restaurant_id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      image: data.image,
      isFeatured: data.is_featured,
      status: data.status as 'available' | 'unavailable'
    };
  };

  const updateMenuItem = async (menuItem: MenuItem): Promise<MenuItem> => {
    // Convert from camelCase to snake_case
    const { data, error } = await supabase
      .from('restaurant_menus')
      .update({
        restaurant_id: menuItem.restaurantId,
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        category: menuItem.category,
        image: menuItem.image,
        is_featured: menuItem.isFeatured,
        status: menuItem.status
      })
      .eq('id', menuItem.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }

    // Convert from snake_case to camelCase for the returned data
    return {
      id: data.id,
      restaurantId: data.restaurant_id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      image: data.image,
      isFeatured: data.is_featured,
      status: data.status as 'available' | 'unavailable'
    };
  };

  const deleteMenuItem = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('restaurant_menus')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  };

  // Use React Query for data fetching and caching
  const { data, isLoading, error } = useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: fetchMenuItems,
    enabled: restaurantId !== undefined
  });

  const createMutation = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', restaurantId] });
      toast.success('Plat ajouté avec succès');
    },
    onError: (error) => {
      console.error('Error creating menu item:', error);
      toast.error('Erreur lors de l\'ajout du plat');
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', restaurantId] });
      toast.success('Plat mis à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating menu item:', error);
      toast.error('Erreur lors de la mise à jour du plat');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', restaurantId] });
      toast.success('Plat supprimé avec succès');
    },
    onError: (error) => {
      console.error('Error deleting menu item:', error);
      toast.error('Erreur lors de la suppression du plat');
    }
  });

  return {
    menuItems: data,
    isLoading,
    error,
    fetchMenuItemById,
    createMenuItem: createMutation.mutate,
    updateMenuItem: updateMutation.mutate,
    deleteMenuItem: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
