
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Restaurant } from '@/features/dining/types';
import { toast } from 'sonner';

export const useRestaurants = () => {
  const queryClient = useQueryClient();

  const fetchRestaurants = async (): Promise<Restaurant[]> => {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }

    // Convert from snake_case to camelCase
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      cuisine: item.cuisine,
      images: item.images,
      openHours: item.open_hours,
      location: item.location,
      status: item.status as 'open' | 'closed'
    }));
  };

  const fetchRestaurantById = async (id: string): Promise<Restaurant> => {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching restaurant with id ${id}:`, error);
      throw error;
    }

    // Convert from snake_case to camelCase
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      cuisine: data.cuisine,
      images: data.images,
      openHours: data.open_hours,
      location: data.location,
      status: data.status as 'open' | 'closed'
    };
  };

  const createRestaurant = async (restaurant: Omit<Restaurant, 'id'>): Promise<Restaurant> => {
    // Convert from camelCase to snake_case
    const { data, error } = await supabase
      .from('restaurants')
      .insert({
        name: restaurant.name,
        description: restaurant.description,
        cuisine: restaurant.cuisine,
        images: restaurant.images,
        open_hours: restaurant.openHours,
        location: restaurant.location,
        status: restaurant.status
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }

    // Convert from snake_case to camelCase for the returned data
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      cuisine: data.cuisine,
      images: data.images,
      openHours: data.open_hours,
      location: data.location,
      status: data.status as 'open' | 'closed'
    };
  };

  const updateRestaurant = async (restaurant: Restaurant): Promise<Restaurant> => {
    // Convert from camelCase to snake_case
    const { data, error } = await supabase
      .from('restaurants')
      .update({
        name: restaurant.name,
        description: restaurant.description,
        cuisine: restaurant.cuisine,
        images: restaurant.images,
        open_hours: restaurant.openHours,
        location: restaurant.location,
        status: restaurant.status
      })
      .eq('id', restaurant.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating restaurant:', error);
      throw error;
    }

    // Convert from snake_case to camelCase for the returned data
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      cuisine: data.cuisine,
      images: data.images,
      openHours: data.open_hours,
      location: data.location,
      status: data.status as 'open' | 'closed'
    };
  };

  const deleteRestaurant = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting restaurant:', error);
      throw error;
    }
  };

  // Use React Query for data fetching and caching
  const { data: restaurants, isLoading, error } = useQuery({
    queryKey: ['restaurants'],
    queryFn: fetchRestaurants
  });

  const createMutation = useMutation({
    mutationFn: createRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      toast.success('Restaurant créé avec succès');
    },
    onError: (error) => {
      console.error('Error creating restaurant:', error);
      toast.error('Erreur lors de la création du restaurant');
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      toast.success('Restaurant mis à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating restaurant:', error);
      toast.error('Erreur lors de la mise à jour du restaurant');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      toast.success('Restaurant supprimé avec succès');
    },
    onError: (error) => {
      console.error('Error deleting restaurant:', error);
      toast.error('Erreur lors de la suppression du restaurant');
    }
  });

  return {
    restaurants,
    isLoading,
    error,
    fetchRestaurantById,
    createRestaurant: createMutation.mutate,
    updateRestaurant: updateMutation.mutate,
    deleteRestaurant: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
