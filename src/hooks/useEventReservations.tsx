
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EventReservation, CreateEventReservationDTO, UpdateEventReservationStatusDTO } from '@/types/event';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { 
  createEventReservation, 
  fetchUserEventReservations, 
  fetchEventReservations,
  updateEventReservationStatus 
} from '@/features/events/services/eventReservationService';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEventReservations = (eventId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id || localStorage.getItem('user_id');
  const userEmail = user?.email || localStorage.getItem('user_email');
  
  const isEventSpecific = !!eventId && eventId !== ':id';
  
  // Query for fetching reservations (either user's or for a specific event)
  const { data: reservations, isLoading, error, refetch } = useQuery({
    queryKey: ['eventReservations', userId, userEmail, eventId],
    queryFn: isEventSpecific ? 
      () => fetchEventReservations(eventId) :
      () => fetchUserEventReservations(userId, userEmail),
    enabled: true,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
  });

  // Mutation for cancelling reservations
  const cancelMutation = useMutation({
    mutationFn: async (reservationId: string): Promise<void> => {
      if (!userId && !userEmail && !isEventSpecific) {
        toast.error("Veuillez vous connecter pour annuler une réservation");
        throw new Error("Utilisateur non authentifié");
      }

      await updateEventReservationStatus({ id: reservationId, status: 'cancelled' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventReservations', userId, userEmail, eventId] });
      toast.success('Réservation annulée avec succès');
    },
    onError: (error) => {
      console.error('Error cancelling event reservation:', error);
      toast.error("Erreur lors de l'annulation de la réservation");
    }
  });

  // Mutation for creating reservations
  const createMutation = useMutation({
    mutationFn: (data: CreateEventReservationDTO) => createEventReservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventReservations', userId, userEmail, eventId] });
      toast.success('Réservation créée avec succès');
    },
    onError: (error: any) => {
      console.error('Error creating event reservation:', error);
      toast.error(error.message || "Erreur lors de la création de la réservation");
    }
  });

  // Mutation for updating reservation status (admin use)
  const updateStatusMutation = useMutation({
    mutationFn: (data: UpdateEventReservationStatusDTO) => updateEventReservationStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventReservations', userId, userEmail, eventId] });
      toast.success('Statut de la réservation mis à jour');
    },
    onError: (error) => {
      console.error('Error updating event reservation status:', error);
      toast.error("Erreur lors de la mise à jour du statut de la réservation");
    }
  });

  // Setup real-time listeners
  useEffect(() => {
    if (!queryClient) return;

    const channels = [];
    
    if (isEventSpecific) {
      // For admin view of event reservations
      console.log(`Setting up real-time listener for event reservations: ${eventId}`);
      
      const eventChannel = supabase
        .channel('event_reservations')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'event_reservations',
          filter: `event_id=eq.${eventId}`,
        }, (payload) => {
          console.log('Event reservation update received:', payload);
          queryClient.invalidateQueries({ queryKey: ['eventReservations', userId, userEmail, eventId] });
          
          // Show notification for new reservations
          if (payload.eventType === 'INSERT') {
            toast.info(`Nouvelle réservation`, {
              description: `Une nouvelle réservation a été créée.`,
              duration: 5000,
            });
          }
        })
        .subscribe();
        
      channels.push(eventChannel);
    } else if (userId || userEmail) {
      // Set up channels for user's own reservations
      console.log("Setting up real-time listener for user event reservations");
      
      if (userId) {
        const userIdChannel = supabase
          .channel('event_reservation_updates_userId')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'event_reservations',
            filter: `user_id=eq.${userId}`,
          }, (payload) => {
            console.log('Event reservation update received by user_id:', payload);
            handleReservationUpdate(payload);
          })
          .subscribe();
          
        channels.push(userIdChannel);
      }
      
      if (userEmail) {
        const emailChannel = supabase
          .channel('event_reservation_updates_email')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'event_reservations',
            filter: `guest_email=eq.${userEmail}`,
          }, (payload) => {
            console.log('Event reservation update received by email:', payload);
            handleReservationUpdate(payload);
          })
          .subscribe();
          
        channels.push(emailChannel);
      }
    }
      
    const handleReservationUpdate = (payload: any) => {
      // For new reservations
      if (payload.eventType === 'INSERT') {
        toast.info(`Nouvelle réservation`, {
          description: `Votre réservation à l'événement a été créée avec succès.`,
          duration: 5000,
        });
        queryClient.invalidateQueries({ queryKey: ['eventReservations', userId, userEmail, eventId] });
        return;
      }
      
      // For status updates
      if (payload.eventType === 'UPDATE') {
        const oldStatus = payload.old.status;
        const newStatus = payload.new.status;
        
        // Only notify if the status has changed
        if (oldStatus !== newStatus) {
          // Show a toast notification
          toast.info(`Mise à jour de réservation`, {
            description: `Votre réservation est maintenant ${getStatusFrench(newStatus)}.`,
            duration: 5000,
          });
        }
        
        // Refetch the reservations to update the UI
        queryClient.invalidateQueries({ queryKey: ['eventReservations', userId, userEmail, eventId] });
      }
    };

    // Helper function for getting status in French
    const getStatusFrench = (status: string) => {
      switch (status) {
        case 'confirmed': return 'confirmée';
        case 'cancelled': return 'annulée';
        case 'pending': return 'en attente';
        default: return status;
      }
    };
      
    return () => {
      console.log("Cleaning up real-time listener for event reservations");
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [userId, userEmail, queryClient, eventId, isEventSpecific]);

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
