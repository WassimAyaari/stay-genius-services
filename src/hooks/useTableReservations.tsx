
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TableReservation } from '@/features/dining/types';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

export const useTableReservations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const fetchReservations = async (): Promise<TableReservation[]> => {
    if (!user?.id) {
      console.log('No authenticated user, returning empty reservations');
      return [];
    }
    
    const { data, error } = await supabase
      .from('table_reservations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }

    return data as TableReservation[];
  };

  const cancelReservation = async (reservationId: string): Promise<void> => {
    const { error } = await supabase
      .from('table_reservations')
      .update({ status: 'cancelled' })
      .eq('id', reservationId)
      .eq('user_id', user?.id); // Ensure only the user's reservations can be cancelled

    if (error) {
      console.error('Error cancelling reservation:', error);
      throw error;
    }
  };

  const { data: reservations, isLoading, error, refetch } = useQuery({
    queryKey: ['tableReservations', user?.id],
    queryFn: fetchReservations,
    enabled: !!user?.id // Only fetch when user is authenticated
  });

  const cancelMutation = useMutation({
    mutationFn: cancelReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableReservations', user?.id] });
      toast.success('Réservation annulée avec succès');
    },
    onError: (error) => {
      console.error('Error cancelling reservation:', error);
      toast.error("Erreur lors de l'annulation de la réservation");
    }
  });

  return {
    reservations,
    isLoading,
    error,
    refetch,
    cancelReservation: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending
  };
};
