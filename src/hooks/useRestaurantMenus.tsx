
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MenuItem } from '@/features/dining/types';
import { toast } from 'sonner';
import {
  fetchMenuItems,
  fetchMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '@/features/dining/services/menuService';

export const useRestaurantMenus = (restaurantId?: string) => {
  const queryClient = useQueryClient();

  // Use React Query for data fetching and caching
  const { data, isLoading, error } = useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: () => fetchMenuItems(restaurantId),
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
