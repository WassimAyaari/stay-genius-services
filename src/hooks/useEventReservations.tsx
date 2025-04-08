
import { useState, useCallback } from 'react';
import { 
  getUserEventReservations, 
  createEventReservation, 
  getEventReservationById, 
  updateEventReservation,
  cancelEventReservation
} from '@/features/events/services/eventReservationService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { EventReservation, CreateEventReservationDTO, UpdateEventReservationDTO } from '@/features/events/types';
import { toast } from 'sonner';

export const useEventReservations = () => {
  const [reservations, setReservations] = useState<EventReservation[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const refetchEventReservations = useCallback(async () => {
    try {
      const userId = user?.id;
      const userEmail = user?.email;
      
      if (userId || userEmail) {
        const data = await getUserEventReservations(userId, userEmail);
        setReservations(data);
        return data;
      }
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations d'événements:", error);
      return [];
    }
  }, [user]);

  const makeEventReservation = useCallback(async (reservationData: CreateEventReservationDTO) => {
    try {
      setLoading(true);
      const result = await createEventReservation(reservationData);
      await refetchEventReservations();
      toast.success("Réservation effectuée avec succès!");
      return result;
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
      toast.error("Erreur lors de la création de la réservation");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refetchEventReservations]);

  const getReservationDetails = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const reservation = await getEventReservationById(id);
      return reservation;
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de réservation:", error);
      toast.error("Impossible de charger les détails de la réservation");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReservationStatus = useCallback(async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      setLoading(true);
      const updateData: UpdateEventReservationDTO = { id, status };
      const result = await updateEventReservation(updateData);
      
      const statusMessages = {
        pending: 'mise en attente',
        confirmed: 'confirmée',
        cancelled: 'annulée'
      };
      
      toast.success(`La réservation a été ${statusMessages[status]}`);
      await refetchEventReservations();
      return result;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refetchEventReservations]);
  
  return {
    reservations,
    loading,
    refetchEventReservations,
    makeEventReservation,
    getReservationDetails,
    updateReservationStatus,
    // Add refetch as an alias for refetchEventReservations to match expected interface
    refetch: refetchEventReservations
  };
};
