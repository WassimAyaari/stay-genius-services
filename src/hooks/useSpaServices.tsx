
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SpaService, SpaBooking } from '@/features/spa/types';

export const useSpaServices = () => {
  const queryClient = useQueryClient();

  // Récupérer tous les services spa
  const fetchServices = async (): Promise<SpaService[]> => {
    const { data, error } = await supabase
      .from('spa_services')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching spa services:', error);
      throw error;
    }

    // Ensure the category is properly typed
    return (data || []).map(service => ({
      ...service,
      category: service.category as 'massage' | 'facial' | 'body' | 'wellness' | string
    })) as SpaService[];
  };

  // Récupérer les services mis en avant
  const fetchFeaturedServices = async (): Promise<SpaService[]> => {
    const { data, error } = await supabase
      .from('spa_services')
      .select('*')
      .eq('is_featured', true)
      .eq('status', 'available')
      .order('name');

    if (error) {
      console.error('Error fetching featured spa services:', error);
      throw error;
    }

    // Ensure the category is properly typed
    return (data || []).map(service => ({
      ...service,
      category: service.category as 'massage' | 'facial' | 'body' | 'wellness' | string
    })) as SpaService[];
  };

  // Réserver un traitement
  const bookTreatmentMutation = useMutation({
    mutationFn: async (booking: Omit<SpaBooking, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('spa_bookings')
        .insert(booking)
        .select()
        .single();

      if (error) {
        console.error('Error booking treatment:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spa-bookings'] });
      toast.success('Réservation effectuée avec succès');
    },
    onError: (error) => {
      console.error('Error in booking mutation:', error);
      toast.error('Erreur lors de la réservation');
    },
  });

  // Récupérer un service par ID
  const getServiceById = async (id: string): Promise<SpaService | null> => {
    const { data, error } = await supabase
      .from('spa_services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching service:', error);
      return null;
    }

    if (!data) return null;

    // Ensure the category is properly typed
    return {
      ...data,
      category: data.category as 'massage' | 'facial' | 'body' | 'wellness' | string
    } as SpaService;
  };

  // Services data
  const { data: services = [], isLoading: isLoadingServices, error: servicesError, refetch: refetchServices } = useQuery({
    queryKey: ['spa-services'],
    queryFn: fetchServices,
  });

  // Featured services data
  const { data: featuredServices = [], isLoading: isLoadingFeatured, error: featuredError } = useQuery({
    queryKey: ['spa-services', 'featured'],
    queryFn: fetchFeaturedServices,
  });

  const isLoading = isLoadingServices || isLoadingFeatured;
  const error = servicesError || featuredError;

  return {
    services,
    featuredServices,
    isLoading,
    error,
    getServiceById,
    bookTreatment: bookTreatmentMutation.mutate,
    isBooking: bookTreatmentMutation.isPending,
    refetch: refetchServices
  };
};
