
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HotelAbout } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { fetchAboutData, updateAboutData, createInitialAbout } from '@/services/hotelAbout/aboutService';

export function useAboutData() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['hotelAbout'],
    queryFn: fetchAboutData
  });
  
  const updateAboutMutation = useMutation({
    mutationFn: updateAboutData,
    onSuccess: () => {
      toast({
        title: "Mise à jour réussie",
        description: "Les informations de l'hôtel ont été mises à jour avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['hotelAbout'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Une erreur est survenue lors de la mise à jour: ${error.message}`,
      });
    }
  });
  
  const createInitialAboutMutation = useMutation({
    mutationFn: createInitialAbout,
    onSuccess: () => {
      toast({
        title: "Création réussie",
        description: "Les informations de l'hôtel ont été créées avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['hotelAbout'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Une erreur est survenue lors de la création: ${error.message}`,
      });
    }
  });
  
  return {
    aboutData: data,
    isLoadingAbout: isLoading,
    aboutError: error,
    updateAboutData: updateAboutMutation.mutate,
    createInitialAboutData: createInitialAboutMutation.mutate
  };
}

