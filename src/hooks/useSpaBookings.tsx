
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SpaBooking } from '@/features/spa/types';

export const useSpaBookings = () => {
  const queryClient = useQueryClient();

  // Récupérer toutes les réservations spa
  const fetchBookings = async (): Promise<SpaBooking[]> => {
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
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching spa bookings:', error);
      throw error;
    }

    return data as unknown as (SpaBooking & {
      spa_services: {
        name: string;
        price: number;
        duration: string;
        description: string;
        category: string;
      };
    })[];
  };

  // Récupérer les réservations d'un utilisateur
  const fetchUserBookings = async (userId: string): Promise<SpaBooking[]> => {
    try {
      console.log('Fetching bookings for user ID:', userId);
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
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching user spa bookings:', error);
        throw error;
      }

      console.log('Found bookings for user:', data?.length || 0);
      return data as unknown as SpaBooking[];
    } catch (error) {
      console.error('Exception in fetchUserBookings:', error);
      return [];
    }
  };

  // Récupérer une réservation par ID
  const getBookingById = async (id: string): Promise<SpaBooking | null> => {
    console.log('Fetching booking by ID:', id);
    try {
      // Récupérer la réservation avec les détails du service
      const { data, error } = await supabase
        .from('spa_bookings')
        .select(`
          *,
          spa_services:service_id (
            id,
            name,
            price,
            duration,
            description,
            category,
            facility_id
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching booking by ID:', error);
        return null;
      }

      if (!data) {
        console.log('No booking found with ID:', id);
        return null;
      }

      console.log('Found booking with service details:', data);
      return data as unknown as SpaBooking;
    } catch (error) {
      console.error('Exception in getBookingById:', error);
      return null;
    }
  };

  // Créer une nouvelle réservation
  const createBookingMutation = useMutation({
    mutationFn: async (booking: Omit<SpaBooking, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('spa_bookings')
        .insert(booking)
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spa-bookings'] });
      toast.success('Réservation créée avec succès');
    },
    onError: (error) => {
      console.error('Error in create booking mutation:', error);
      toast.error('Erreur lors de la création de la réservation');
    },
  });

  // Mettre à jour le statut d'une réservation
  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('spa_bookings')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating booking status:', error);
        throw error;
      }

      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spa-bookings'] });
      toast.success('Statut de la réservation mis à jour');
    },
    onError: (error) => {
      console.error('Error in update booking status mutation:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    },
  });

  // Add cancellation functionality
  const cancelBookingMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('spa_bookings')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) {
        console.error('Error cancelling booking:', error);
        throw error;
      }

      return { id, status: 'cancelled' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spa-bookings'] });
      toast.success('Réservation annulée avec succès');
    },
    onError: (error) => {
      console.error('Error in cancel booking mutation:', error);
      toast.error('Erreur lors de l\'annulation de la réservation');
    },
  });

  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ['spa-bookings'],
    queryFn: fetchBookings,
  });

  return {
    bookings: data,
    isLoading,
    error,
    getBookingById,
    createBooking: createBookingMutation.mutate,
    updateBookingStatus: updateBookingStatusMutation.mutate,
    cancelBooking: cancelBookingMutation.mutate,
    isCreating: createBookingMutation.isPending,
    isUpdating: updateBookingStatusMutation.isPending,
    isCancelling: cancelBookingMutation.isPending,
    fetchUserBookings,
    refetch: refetch
  };
};
