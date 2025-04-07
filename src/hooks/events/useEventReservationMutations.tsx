
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateEventReservationDTO, UpdateEventReservationStatusDTO } from '@/types/event';
import { toast } from 'sonner';
import { 
  createEventReservation, 
  updateEventReservationStatus 
} from '@/features/events/services/eventReservationService';

/**
 * Hook for event reservation mutations (create, update, cancel)
 */
export const useEventReservationMutations = (userId?: string | null, userEmail?: string | null, eventId?: string) => {
  const queryClient = useQueryClient();
  
  // Mutation for cancelling reservations
  const cancelMutation = useMutation({
    mutationFn: async (reservationId: string): Promise<void> => {
      if (!userId && !userEmail && !eventId) {
        toast.error("Veuillez vous connecter pour annuler une réservation");
        throw new Error("Utilisateur non authentifié");
      }

      await updateEventReservationStatus({ id: reservationId, status: 'cancelled' });
    },
    onSuccess: () => {
      // Invalidate related queries after a delay to ensure DB has processed the change
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['eventReservations', userId, userEmail, eventId] });
      }, 3000);
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
      // Invalidate related queries after a delay
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['eventReservations', userId, userEmail, eventId] });
      }, 3000);
      toast.success('Réservation créée avec succès');
    },
    onError: (error: any) => {
      console.error('Error creating event reservation:', error);
      toast.error(error.message || "Erreur lors de la création de la réservation");
    }
  });

  // Mutation for updating reservation status (admin use)
  const updateStatusMutation = useMutation({
    mutationFn: (data: UpdateEventReservationStatusDTO) => {
      console.log('Mutation function called with data:', data);
      return updateEventReservationStatus(data);
    },
    onSuccess: () => {
      console.log('Status update successful');
      // Invalidate queries after a longer delay to ensure DB has processed the change
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['eventReservations'] });
      }, 3500); // Increased delay
      
      // Don't show success toast here, it's handled in the component
      // to avoid duplicate notifications
    },
    onError: (error: any) => {
      console.error('Error updating event reservation status:', error);
      toast.error("Erreur lors de la mise à jour du statut: " + (error.message || "Erreur inconnue"));
    }
  });

  return {
    cancelReservation: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending,
    createReservation: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateReservationStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending
  };
};
