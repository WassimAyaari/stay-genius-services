
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SpaBooking } from '@/features/spa/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSpaBookings = (userId?: string) => {
  const queryClient = useQueryClient();

  // Fetch all bookings for a user
  const { 
    data: bookings = [], 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['spaBookings', userId],
    queryFn: async () => {
      if (!userId) return [];

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
    },
    enabled: !!userId
  });

  // Update booking status
  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('spa_bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaBookings'] });
      toast.success('Statut de la réservation mis à jour');
    },
    onError: (error) => {
      console.error('Error updating booking status:', error);
      toast.error('Échec de la mise à jour du statut');
    }
  });

  // Cancel booking
  const cancelBookingMutation = useMutation({
    mutationFn: async (id: string) => {
      return updateBookingStatusMutation.mutate({ id, status: 'cancelled' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaBookings'] });
      toast.success('Réservation annulée');
    }
  });

  // Get booking by ID
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

    return data;
  };

  return {
    bookings,
    isLoading,
    refetch,
    updateBookingStatus: updateBookingStatusMutation.mutate,
    cancelBooking: cancelBookingMutation.mutate,
    getBookingById
  };
};
