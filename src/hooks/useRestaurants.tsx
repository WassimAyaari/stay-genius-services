
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Restaurant } from '@/features/dining/types';
import { 
  fetchRestaurants, 
  fetchRestaurantById, 
  fetchFeaturedRestaurants,
  createRestaurant as createRestaurantService, 
  updateRestaurant as updateRestaurantService, 
  deleteRestaurant as deleteRestaurantService 
} from '@/features/dining/services/restaurantService';

export const useRestaurants = () => {
  const queryClient = useQueryClient();

  // Use React Query for data fetching and caching
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['restaurants'],
    queryFn: fetchRestaurants,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  const { 
    data: featuredRestaurants,
    isLoading: isFeaturedLoading
  } = useQuery({
    queryKey: ['featuredRestaurants'],
    queryFn: fetchFeaturedRestaurants,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  const createMutation = useMutation({
    mutationFn: createRestaurantService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['featuredRestaurants'] });
      toast.success('Restaurant créé avec succès');
    },
    onError: (error) => {
      console.error('Error creating restaurant:', error);
      toast.error('Erreur lors de la création du restaurant');
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateRestaurantService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['featuredRestaurants'] });
      toast.success('Restaurant mis à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating restaurant:', error);
      toast.error('Erreur lors de la mise à jour du restaurant');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRestaurantService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['featuredRestaurants'] });
      toast.success('Restaurant supprimé avec succès');
    },
    onError: (error) => {
      console.error('Error deleting restaurant:', error);
      toast.error('Erreur lors de la suppression du restaurant');
    }
  });

  return {
    restaurants: data,
    featuredRestaurants,
    isLoading,
    isFeaturedLoading,
    error,
    refetch,
    fetchRestaurantById,
    createRestaurant: createMutation.mutate,
    updateRestaurant: updateMutation.mutate,
    deleteRestaurant: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
