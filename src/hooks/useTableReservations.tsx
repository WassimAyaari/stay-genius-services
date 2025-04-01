
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TableReservation, CreateTableReservationDTO, UpdateReservationStatusDTO } from '@/features/dining/types';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { createReservation as apiCreateReservation, fetchReservations, updateReservationStatus as apiUpdateReservationStatus } from '@/features/dining/services/reservationService';
import { useEffect } from 'react';

export const useTableReservations = (restaurantId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id || localStorage.getItem('user_id');

  // Fetch user's reservations
  const fetchUserReservations = async (): Promise<TableReservation[]> => {
    if (!userId) {
      console.log('No authenticated user or user_id in localStorage, returning empty reservations');
      return [];
    }
    
    console.log('Fetching reservations for user ID:', userId);
    
    // Essayer d'abord en utilisant l'ID de l'utilisateur authentifié
    let query = supabase
      .from('table_reservations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    let { data, error } = await query;
    
    // Si aucune réservation n'est trouvée ou s'il y a une erreur, essayons de chercher par email
    if ((error || !data || data.length === 0) && user?.email) {
      console.log('No reservations found by user_id, trying by email:', user.email);
      query = supabase
        .from('table_reservations')
        .select('*')
        .eq('guest_email', user.email)
        .order('created_at', { ascending: false });
      
      const emailResult = await query;
      data = emailResult.data;
      error = emailResult.error;
    }

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
    if (!userId) {
      toast.error("Veuillez vous connecter pour annuler une réservation");
      throw new Error("Utilisateur non authentifié");
    }

    const { error } = await supabase
      .from('table_reservations')
      .update({ status: 'cancelled' })
      .eq('id', reservationId);

    if (error) {
      console.error('Error cancelling reservation:', error);
      throw error;
    }
  };

  // Query for fetching reservations (either user's or restaurant's)
  const { data: reservations, isLoading, error, refetch } = useQuery({
    queryKey: ['tableReservations', userId, restaurantId],
    queryFn: restaurantId ? fetchRestaurantReservations : fetchUserReservations,
    enabled: true,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
  });

  // Mutation for cancelling reservations
  const cancelMutation = useMutation({
    mutationFn: cancelReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableReservations', userId, restaurantId] });
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
      queryClient.invalidateQueries({ queryKey: ['tableReservations', userId, restaurantId] });
    }
  });

  // Mutation for updating reservation status (admin use)
  const updateStatusMutation = useMutation({
    mutationFn: (data: UpdateReservationStatusDTO) => apiUpdateReservationStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableReservations', userId, restaurantId] });
      toast.success('Statut de la réservation mis à jour');
    },
    onError: (error) => {
      console.error('Error updating reservation status:', error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  });

  // Subscribe to real-time updates for table reservations
  useEffect(() => {
    if (!userId) return;
    
    console.log("Setting up real-time listener for reservations for user:", userId);
    
    // Canal pour les réservations liées à l'ID utilisateur
    const userIdChannel = supabase
      .channel('reservation_updates_userId')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'table_reservations',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        console.log('Reservation update received by user_id:', payload);
        handleReservationUpdate(payload);
      })
      .subscribe();
    
    // Si nous avons un email d'utilisateur, écoutons aussi les mises à jour basées sur l'email
    let emailChannel;
    if (user?.email) {
      console.log("Setting up real-time listener for reservations with email:", user.email);
      emailChannel = supabase
        .channel('reservation_updates_email')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'table_reservations',
          filter: `guest_email=eq.${user.email}`,
        }, (payload) => {
          console.log('Reservation update received by email:', payload);
          handleReservationUpdate(payload);
        })
        .subscribe();
    }
      
    const handleReservationUpdate = (payload: any) => {
      const oldStatus = payload.old.status;
      const newStatus = payload.new.status;
      
      // Only notify if the status has changed
      if (oldStatus !== newStatus) {
        // Get the status text in French
        const getStatusFrench = (status: string) => {
          switch (status) {
            case 'confirmed': return 'confirmée';
            case 'cancelled': return 'annulée';
            case 'pending': return 'en attente';
            default: return status;
          }
        };
        
        // Show a toast notification
        toast.info(`Mise à jour de réservation`, {
          description: `Votre réservation est maintenant ${getStatusFrench(newStatus)}.`,
          duration: 5000,
        });
        
        // Refetch the reservations to update the UI
        queryClient.invalidateQueries({ queryKey: ['tableReservations', userId, restaurantId] });
      }
    };
      
    return () => {
      console.log("Cleaning up real-time listener for reservations");
      supabase.removeChannel(userIdChannel);
      if (emailChannel) {
        supabase.removeChannel(emailChannel);
      }
    };
  }, [userId, queryClient, restaurantId, user?.email]);

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
