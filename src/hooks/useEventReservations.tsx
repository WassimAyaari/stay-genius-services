
import { useState, useCallback } from 'react';
import { getUserEventReservations } from '@/features/events/services/eventReservationService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

export const useEventReservations = () => {
  const [reservations, setReservations] = useState([]);
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
  
  return {
    reservations,
    refetchEventReservations,
    // Add refetch as an alias for refetchEventReservations to match expected interface
    refetch: refetchEventReservations
  };
};
