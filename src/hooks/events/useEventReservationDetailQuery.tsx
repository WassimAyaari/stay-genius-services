
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EventReservation, Event } from '@/types/event';

interface EventReservationDetail extends EventReservation {
  event?: Event;
}

/**
 * Hook for fetching event reservation details
 */
export const useEventReservationDetailQuery = (reservationId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { data: reservation, refetch } = useQuery({
    queryKey: ['eventReservation', reservationId],
    queryFn: async (): Promise<EventReservationDetail | null> => {
      try {
        setIsLoading(true);
        
        if (!reservationId) {
          throw new Error('Reservation ID is required');
        }
        
        // Fetch the reservation
        const { data: reservationData, error: reservationError } = await supabase
          .from('event_reservations')
          .select('*')
          .eq('id', reservationId)
          .single();
          
        if (reservationError) throw reservationError;
        if (!reservationData) return null;
        
        // Convert the database row to our EventReservation type
        const reservation: EventReservation = {
          id: reservationData.id,
          eventId: reservationData.event_id,
          userId: reservationData.user_id || undefined,
          guestName: reservationData.guest_name || undefined,
          guestEmail: reservationData.guest_email || undefined,
          guestPhone: reservationData.guest_phone || undefined,
          roomNumber: reservationData.room_number || undefined,
          date: reservationData.date,
          guests: reservationData.guests,
          specialRequests: reservationData.special_requests || undefined,
          status: reservationData.status as 'pending' | 'confirmed' | 'cancelled',
          createdAt: reservationData.created_at
        };
        
        // Fetch the associated event
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', reservation.eventId)
          .single();
          
        if (eventError) {
          console.error('Error fetching event:', eventError);
          // Continue even if event fetch fails
        }
        
        // Cast the event category to the expected type to ensure it's valid
        let eventWithCorrectType: Event | undefined;
        
        if (eventData) {
          eventWithCorrectType = {
            ...eventData,
            category: (eventData.category === 'event' || eventData.category === 'promo') 
              ? eventData.category 
              : 'event' // Default to 'event' if the category is not valid
          } as Event;
        }
        
        return {
          ...reservation,
          event: eventWithCorrectType
        };
      } catch (error) {
        console.error('Error fetching event reservation:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch reservation'));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    enabled: !!reservationId
  });

  return {
    reservation,
    isLoading,
    error,
    refetch
  };
};
