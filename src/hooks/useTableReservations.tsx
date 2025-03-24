
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TableReservation } from '@/features/dining/types';
import { toast } from 'sonner';

export const useTableReservations = (restaurantId?: string) => {
  const queryClient = useQueryClient();

  const fetchReservations = async (): Promise<TableReservation[]> => {
    let query = supabase
      .from('table_reservations')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    
    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }

    // Convert from snake_case to camelCase
    return data.map(item => ({
      id: item.id,
      restaurantId: item.restaurant_id,
      userId: item.user_id,
      guestName: item.guest_name,
      guestEmail: item.guest_email,
      guestPhone: item.guest_phone,
      date: item.date,
      time: item.time,
      guests: item.guests,
      specialRequests: item.special_requests,
      status: item.status as 'pending' | 'confirmed' | 'cancelled',
      createdAt: item.created_at
    }));
  };

  const createReservation = async (reservation: Omit<TableReservation, 'id' | 'createdAt'>): Promise<TableReservation> => {
    // Convert from camelCase to snake_case
    const { data, error } = await supabase
      .from('table_reservations')
      .insert({
        restaurant_id: reservation.restaurantId,
        user_id: reservation.userId,
        guest_name: reservation.guestName,
        guest_email: reservation.guestEmail,
        guest_phone: reservation.guestPhone,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        special_requests: reservation.specialRequests,
        status: reservation.status
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }

    // Convert from snake_case to camelCase for the returned data
    return {
      id: data.id,
      restaurantId: data.restaurant_id,
      userId: data.user_id,
      guestName: data.guest_name,
      guestEmail: data.guest_email,
      guestPhone: data.guest_phone,
      date: data.date,
      time: data.time,
      guests: data.guests,
      specialRequests: data.special_requests,
      status: data.status as 'pending' | 'confirmed' | 'cancelled',
      createdAt: data.created_at
    };
  };

  const updateReservationStatus = async ({ id, status }: { id: string; status: 'pending' | 'confirmed' | 'cancelled' }): Promise<void> => {
    const { error } = await supabase
      .from('table_reservations')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating reservation status:', error);
      throw error;
    }
  };

  // Use React Query for data fetching and caching
  const { data: reservations, isLoading, error } = useQuery({
    queryKey: ['tableReservations', restaurantId],
    queryFn: fetchReservations
  });

  const createMutation = useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableReservations', restaurantId] });
      toast.success('Réservation créée avec succès');
    },
    onError: (error) => {
      console.error('Error creating reservation:', error);
      toast.error('Erreur lors de la création de la réservation');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateReservationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableReservations', restaurantId] });
      toast.success('Statut de la réservation mis à jour');
    },
    onError: (error) => {
      console.error('Error updating reservation status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  });

  return {
    reservations,
    isLoading,
    error,
    createReservation: createMutation.mutate,
    updateReservationStatus: updateStatusMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateStatusMutation.isPending
  };
};
