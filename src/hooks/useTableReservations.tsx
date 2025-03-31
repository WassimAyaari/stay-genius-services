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
    
    if (restaurantId && restaurantId !== ':id') {
      query = query.eq('restaurant_id', restaurantId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }

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
    if (!reservation.restaurantId || reservation.restaurantId === ':id') {
      throw new Error('Invalid restaurant ID');
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || null;
    
    // Remove reference to process.env which is causing the error
    try {
      const { data, error } = await supabase
        .from('table_reservations')
        .insert({
          restaurant_id: reservation.restaurantId,
          user_id: userId,
          guest_name: reservation.guestName,
          guest_email: reservation.guestEmail,
          guest_phone: reservation.guestPhone,
          room_number: reservation.roomNumber, // Make sure we include the room number
          date: reservation.date,
          time: reservation.time,
          guests: reservation.guests,
          menu_id: reservation.menuId, // Add menu_id to the insert
          special_requests: reservation.specialRequests,
          status: reservation.status
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating reservation:', error);
        throw error;
      }

      return {
        id: data.id,
        restaurantId: data.restaurant_id,
        userId: data.user_id,
        guestName: data.guest_name,
        guestEmail: data.guest_email,
        guestPhone: data.guest_phone,
        roomNumber: data.room_number,
        date: data.date,
        time: data.time,
        guests: data.guests,
        menuId: data.menu_id,
        specialRequests: data.special_requests,
        status: data.status as 'pending' | 'confirmed' | 'cancelled',
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Failed to create reservation, trying alternative approach:', error);
      
      try {
        const { data, error: directError } = await supabase
          .from('table_reservations')
          .insert({
            restaurant_id: reservation.restaurantId,
            guest_name: reservation.guestName,
            guest_email: reservation.guestEmail,
            guest_phone: reservation.guestPhone,
            room_number: reservation.roomNumber,
            date: reservation.date,
            time: reservation.time,
            guests: reservation.guests,
            menu_id: reservation.menuId,
            special_requests: reservation.specialRequests || '',
            status: reservation.status
          })
          .select()
          .single();
          
        if (directError) {
          throw directError;
        }
        
        return {
          id: data.id,
          restaurantId: data.restaurant_id,
          userId: data.user_id,
          guestName: data.guest_name,
          guestEmail: data.guest_email,
          guestPhone: data.guest_phone,
          roomNumber: data.room_number,
          date: data.date,
          time: data.time,
          guests: data.guests,
          menuId: data.menu_id,
          specialRequests: data.special_requests,
          status: data.status as 'pending' | 'confirmed' | 'cancelled',
          createdAt: data.created_at
        };
      } catch (directError) {
        console.error('Both reservation methods failed:', directError);
        throw new Error('Unable to create reservation due to permission restrictions');
      }
    }
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

  const { data: reservations, isLoading, error } = useQuery({
    queryKey: ['tableReservations', restaurantId],
    queryFn: fetchReservations,
    enabled: !restaurantId || restaurantId !== ':id'
  });

  const createMutation = useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableReservations', restaurantId] });
      toast.success('Réservation créée avec succès');
    },
    onError: (error) => {
      console.error('Error creating reservation:', error);
      toast.error('Erreur lors de la création de la réservation: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
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
