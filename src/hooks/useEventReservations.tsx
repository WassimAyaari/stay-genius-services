
import { useState } from 'react';

export const useEventReservations = () => {
  const [reservations, setReservations] = useState([]);
  
  const refetchEventReservations = async () => {
    // Cette fonction ne fait plus rien car les réservations d'événements ont été supprimées
    console.log('Reservation system has been removed');
    return [];
  };
  
  return {
    reservations,
    refetchEventReservations,
    // Add refetch as an alias for refetchEventReservations to match expected interface
    refetch: refetchEventReservations
  };
};
