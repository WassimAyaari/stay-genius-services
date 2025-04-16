
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
        title: "Update Successful",
        description: "Hotel information has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['hotelAbout'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `An error occurred during update: ${error.message}`,
      });
    }
  });
  
  const createInitialAboutMutation = useMutation({
    mutationFn: createInitialAbout,
    onSuccess: () => {
      toast({
        title: "Creation Successful",
        description: "Hotel information has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['hotelAbout'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `An error occurred during creation: ${error.message}`,
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
