
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { EventReservation } from '@/types/event';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { 
  fetchUserEventReservations, 
  fetchEventReservations,
} from '@/features/events/services/eventReservationService';

/**
 * Hook to fetch event reservations for a specific event or for the current user
 */
export const useEventReservationQueries = (eventId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id || localStorage.getItem('user_id');
  const userEmail = user?.email || localStorage.getItem('user_email');
  
  const isEventSpecific = !!eventId && eventId !== ':id';
  
  // Query for fetching reservations (either user's or for a specific event)
  const { 
    data: reservations, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['eventReservations', userId, userEmail, eventId],
    queryFn: isEventSpecific ? 
      () => fetchEventReservations(eventId) :
      () => fetchUserEventReservations(userId, userEmail),
    enabled: true,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
  });

  return {
    reservations: reservations || [],
    isLoading,
    error,
    refetch,
    queryClient,
    userId,
    userEmail,
    isEventSpecific
  };
};
