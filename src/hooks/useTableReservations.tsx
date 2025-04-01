
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TableReservation, CreateTableReservationDTO, UpdateReservationStatusDTO } from '@/features/dining/types';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { createReservation as apiCreateReservation, fetchReservations, updateReservationStatus as apiUpdateReservationStatus } from '@/features/dining/services/reservationService';

export const useTableReservations = (restaurantId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch user's reservations
  const fetchUserReservations = async (): Promise<TableReservation[]> => {
    if (!user?.id) {
      console.log('No authenticated user, returning empty reservations');
      return [];
    }
    
    console.log('Fetching reservations for auth user:', user.id);
    
    const { data, error } = await supabase
      .from('table_reservations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }

    console.log('Raw reservations data:', data);

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

  // Fetch restaurant reservations (for admin)
  const fetchRestaurantReservations = async (): Promise<TableReservation[]> => {
    if (!restaurantId || restaurantId === ':id') {
      return [];
    }
    
    return fetchReservations(restaurantId);
  };

  // Cancel reservation
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

  // Query for fetching reservations (either user's or restaurant's)
  const { data: reservations, isLoading, error, refetch } = useQuery({
    queryKey: ['tableReservations', user?.id, restaurantId],
    queryFn: restaurantId ? fetchRestaurantReservations : fetchUserReservations,
    enabled: !!user?.id || !!restaurantId, // Only fetch when user is authenticated or restaurantId is provided
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
  });

  // Mutation for cancelling reservations
  const cancelMutation = useMutation({
    mutationFn: cancelReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableReservations', user?.id, restaurantId] });
      toast.success('Réservation annulée avec succès');
    },
    onError: (error) => {
      console.error('Error cancelling reservation:', error);
      toast.error("Erreur lors de l'annulation de la réservation");
    }
  });

  // Mutation for creating reservations
  const createMutation = useMutation({
    mutationFn: (data: CreateTableReservationDTO) => apiCreateReservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableReservations', user?.id, restaurantId] });
    }
  });

  // Mutation for updating reservation status (admin use)
  const updateStatusMutation = useMutation({
    mutationFn: (data: UpdateReservationStatusDTO) => apiUpdateReservationStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableReservations', user?.id, restaurantId] });
      toast.success('Statut de la réservation mis à jour');
    },
    onError: (error) => {
      console.error('Error updating reservation status:', error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  });

  return {
    reservations: reservations || [],
    isLoading,
    error,
    refetch,
    cancelReservation: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending,
    createReservation: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateReservationStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending
  };
};
