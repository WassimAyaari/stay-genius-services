
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
  const userEmail = user?.email || localStorage.getItem('user_email');

  // Fetch user's reservations
  const fetchUserReservations = async (): Promise<TableReservation[]> => {
    if (!userId && !userEmail) {
      console.log('No authenticated user or user_id/email in localStorage, returning empty reservations');
      return [];
    }
    
    let reservations: TableReservation[] = [];
    
    // Essayer d'abord en utilisant l'ID de l'utilisateur authentifié
    if (userId) {
      console.log('Fetching reservations for user ID:', userId);
      
      let query = supabase
        .from('table_reservations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      let { data, error } = await query;
      
      if (error) {
        console.error('Error fetching reservations by user_id:', error);
      } else if (data && data.length > 0) {
        console.log('Found reservations by user_id:', data.length);
        reservations = [...reservations, ...transformReservations(data)];
      }
    }
    
    // Si un email est disponible, chercher aussi par email
    if (userEmail) {
      console.log('Fetching reservations for user email:', userEmail);
      
      const query = supabase
        .from('table_reservations')
        .select('*')
        .eq('guest_email', userEmail)
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching reservations by email:', error);
      } else if (data && data.length > 0) {
        console.log('Found reservations by email:', data.length);
        
        // Fusionner les résultats en évitant les doublons
        const existingIds = new Set(reservations.map(r => r.id));
        const newReservations = transformReservations(data).filter(r => !existingIds.has(r.id));
        
        reservations = [...reservations, ...newReservations];
      }
    }

    console.log('Total unique reservations found:', reservations.length);
    return reservations;
  };

  // Helper function to transform reservation data
  const transformReservations = (data: any[]): TableReservation[] => {
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
    if (!userId && !userEmail) {
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
    queryKey: ['tableReservations', userId, userEmail, restaurantId],
    queryFn: restaurantId ? fetchRestaurantReservations : fetchUserReservations,
    enabled: true,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
  });

  // Mutation for cancelling reservations
  const cancelMutation = useMutation({
    mutationFn: cancelReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableReservations', userId, userEmail, restaurantId] });
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
      queryClient.invalidateQueries({ queryKey: ['tableReservations', userId, userEmail, restaurantId] });
    }
  });

  // Mutation for updating reservation status (admin use)
  const updateStatusMutation = useMutation({
    mutationFn: (data: UpdateReservationStatusDTO) => apiUpdateReservationStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableReservations', userId, userEmail, restaurantId] });
      toast.success('Statut de la réservation mis à jour');
    },
    onError: (error) => {
      console.error('Error updating reservation status:', error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  });

  // Subscribe to real-time updates for table reservations
  useEffect(() => {
    if (!userId && !userEmail) return;
    
    console.log("Setting up real-time listener for reservations with user ID:", userId, "and email:", userEmail);
    
    const channels = [];
    
    // Canal pour les réservations liées à l'ID utilisateur
    if (userId) {
      const userIdChannel = supabase
        .channel('reservation_updates_userId')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'table_reservations',
          filter: `user_id=eq.${userId}`,
        }, (payload) => {
          console.log('Reservation update received by user_id:', payload);
          handleReservationUpdate(payload);
        })
        .subscribe();
        
      channels.push(userIdChannel);
    }
    
    // Si nous avons un email d'utilisateur, écoutons aussi les mises à jour basées sur l'email
    if (userEmail) {
      const emailChannel = supabase
        .channel('reservation_updates_email')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'table_reservations',
          filter: `guest_email=eq.${userEmail}`,
        }, (payload) => {
          console.log('Reservation update received by email:', payload);
          handleReservationUpdate(payload);
        })
        .subscribe();
        
      channels.push(emailChannel);
    }
      
    const handleReservationUpdate = (payload: any) => {
      // Pour les nouvelles réservations
      if (payload.eventType === 'INSERT') {
        toast.info(`Nouvelle réservation`, {
          description: `Votre réservation a été créée avec succès.`,
          duration: 5000,
        });
        queryClient.invalidateQueries({ queryKey: ['tableReservations', userId, userEmail, restaurantId] });
        return;
      }
      
      // Pour les mises à jour de statut
      if (payload.eventType === 'UPDATE') {
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
        }
        
        // Refetch the reservations to update the UI
        queryClient.invalidateQueries({ queryKey: ['tableReservations', userId, userEmail, restaurantId] });
      }
    };
      
    return () => {
      console.log("Cleaning up real-time listener for reservations");
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [userId, userEmail, queryClient, restaurantId]);

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
