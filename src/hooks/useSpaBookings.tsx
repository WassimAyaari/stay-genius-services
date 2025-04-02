
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SpaBooking } from '@/features/spa/types';

export const useSpaBookings = () => {
  const queryClient = useQueryClient();

  // Récupérer toutes les réservations de l'utilisateur actuel
  const fetchUserBookings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('spa_bookings')
      .select(`
        *,
        spa_services:service_id (
          name,
          price,
          duration,
          description,
          category
        )
      `)
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching spa bookings:', error);
      throw error;
    }

    return data as (SpaBooking & { 
      spa_services: { 
        name: string;
        price: number;
        duration: string;
        description: string;
        category: string;
      } 
    })[];
  };

  // Récupérer une réservation par ID
  const getBookingById = async (id: string): Promise<SpaBooking | null> => {
    const { data, error } = await supabase
      .from('spa_bookings')
      .select(`
        *,
        spa_services:service_id (
          name,
          price,
          duration,
          description,
          category
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching booking:', error);
      return null;
    }

    return data as SpaBooking;
  };

  // Créer ou mettre à jour une réservation
  const bookTreatmentMutation = useMutation({
    mutationFn: async (booking: Omit<SpaBooking, 'id'>) => {
      const { data, error } = await supabase
        .from('spa_bookings')
        .insert(booking)
        .select('id')
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

  // Mettre à jour le statut d'une réservation
  const updateBookingStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    const { error } = await supabase
      .from('spa_bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }

    queryClient.invalidateQueries({ queryKey: ['spa-bookings'] });
    return true;
  };

  // Annuler une réservation
  const cancelBooking = async (id: string) => {
    return updateBookingStatus(id, 'cancelled');
  };

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['spa-bookings'],
    queryFn: fetchUserBookings,
  });

  return {
    data,
    isLoading,
    error,
    getBookingById,
    bookTreatment: bookTreatmentMutation.mutate,
    isBooking: bookTreatmentMutation.isPending,
    updateBookingStatus,
    cancelBooking,
  };
};
