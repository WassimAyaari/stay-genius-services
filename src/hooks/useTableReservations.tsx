
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

    // Transform the data to match the TableReservation type
    return (data || []).map(item => ({
      id: item.id,
      restaurantId: item.restaurant_id,
      userId: item.user_id,
      date: item.date,
      time: item.time,
      guests: item.guests,
      guestName: item.guest_name || '',
      guestEmail: item.guest_email || '',
      guestPhone: item.guest_phone || '',
      specialRequests: item.special_requests || '',
      status: item.status,
      roomNumber: item.room_number || '',
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })) as TableReservation[];
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
    reservations: reservations || [],
    isLoading,
    error,
    refetch,
    cancelReservation: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending
  };
};
