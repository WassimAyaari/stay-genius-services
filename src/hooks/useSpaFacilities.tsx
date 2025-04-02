
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SpaFacility } from '@/features/spa/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSpaFacilities = () => {
  const queryClient = useQueryClient();

  // Get all spa facilities
  const { data: facilities = [], isLoading, refetch } = useQuery({
    queryKey: ['spaFacilities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spa_facilities')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      return data as SpaFacility[];
    }
  });

  // Create a new facility
  const createFacilityMutation = useMutation({
    mutationFn: async (facility: Omit<SpaFacility, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('spa_facilities')
        .insert(facility)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaFacilities'] });
      toast.success('Installation créée avec succès');
    },
    onError: (error) => {
      console.error('Error creating facility:', error);
      toast.error('Erreur lors de la création de l\'installation');
    }
  });

  // Update a facility
  const updateFacilityMutation = useMutation({
    mutationFn: async ({ id, ...facility }: Partial<SpaFacility> & { id: string }) => {
      const { data, error } = await supabase
        .from('spa_facilities')
        .update(facility)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaFacilities'] });
      toast.success('Installation mise à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating facility:', error);
      toast.error('Erreur lors de la mise à jour de l\'installation');
    }
  });

  // Delete a facility
  const deleteFacilityMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('spa_facilities')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaFacilities'] });
      toast.success('Installation supprimée avec succès');
    },
    onError: (error) => {
      console.error('Error deleting facility:', error);
      toast.error('Erreur lors de la suppression de l\'installation');
    }
  });

  return {
    facilities,
    isLoading,
    refetch,
    createFacility: createFacilityMutation.mutate,
    updateFacility: updateFacilityMutation.mutate,
    deleteFacility: deleteFacilityMutation.mutate,
    isCreating: createFacilityMutation.isPending,
    isUpdating: updateFacilityMutation.isPending,
    isDeleting: deleteFacilityMutation.isPending
  };
};
