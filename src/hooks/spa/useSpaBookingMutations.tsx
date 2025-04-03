
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SpaBooking } from '@/features/spa/types';

export const useSpaBookingMutations = () => {
  const queryClient = useQueryClient();

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

  return {
    createBooking: createBookingMutation.mutate,
    updateBookingStatus: updateBookingStatusMutation.mutate,
    cancelBooking: cancelBookingMutation.mutate,
    isCreating: createBookingMutation.isPending,
    isUpdating: updateBookingStatusMutation.isPending,
    isCancelling: cancelBookingMutation.isPending,
  };
};
