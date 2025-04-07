
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EventReservation, Event } from '@/types/event';
import { toast } from 'sonner';

interface EventReservationDetail extends EventReservation {
  event?: Event;
}

export const useEventReservationDetail = (reservationId: string) => {
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
  
  // Mutation to cancel the reservation
  const cancelReservation = async () => {
    try {
      if (!reservation) throw new Error('No reservation to cancel');
      
      // Modifié pour ne pas utiliser de champ updated_at
      const { error } = await supabase
        .from('event_reservations')
        .update({ status: 'cancelled' })
        .eq('id', reservationId);
        
      if (error) throw error;
      
      toast.success('Réservation annulée avec succès');
      refetch();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast.error('Erreur lors de l\'annulation de la réservation');
    }
  };

  return {
    reservation,
    isLoading,
    error,
    refetch,
    cancelReservation
  };
};
