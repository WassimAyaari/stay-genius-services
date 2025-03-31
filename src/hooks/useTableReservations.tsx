
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TableReservation, CreateTableReservationDTO, UpdateReservationStatusDTO } from '@/features/dining/types';
import { toast } from 'sonner';
import {
  fetchReservations,
  createReservation,
  updateReservationStatus
} from '@/features/dining/services/reservationService';

export const useTableReservations = (restaurantId?: string) => {
  const queryClient = useQueryClient();

  const { data: reservations, isLoading, error } = useQuery({
    queryKey: ['tableReservations', restaurantId],
    queryFn: () => fetchReservations(restaurantId),
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
