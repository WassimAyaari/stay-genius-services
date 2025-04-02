
import { useTableReservationsCore } from './reservations/useTableReservationsCore';
import { TableReservation, CreateTableReservationDTO, UpdateReservationStatusDTO } from '@/features/dining/types';

/**
 * Hook for fetching and managing table reservations with real-time updates
 * @param restaurantId Optional restaurant ID to fetch restaurant-specific reservations
 */
export const useTableReservations = (restaurantId?: string) => {
  return useTableReservationsCore(restaurantId);
};
