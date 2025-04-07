
import { supabase } from '@/integrations/supabase/client';
import { EventReservation } from '@/types/event';
import { mapRowToEventReservation } from './mappers/eventReservationMapper';
import { EventReservationRow } from '../types/eventReservation';

/**
 * Fetch reservations for an event
 */
export const fetchEventReservations = async (eventId?: string): Promise<EventReservation[]> => {
  let query = supabase
    .from('event_reservations')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (eventId) {
    query = query.eq('event_id', eventId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching event reservations:', error);
    throw error;
  }

  // Map the data to our EventReservation type
  return data ? (data as EventReservationRow[]).map(mapRowToEventReservation) : [];
};

/**
 * Fetch user's event reservations
 */
export const fetchUserEventReservations = async (
  userId?: string | null, 
  userEmail?: string | null
): Promise<EventReservation[]> => {
  if (!userId && !userEmail) {
    return [];
  }
  
  let reservations: EventReservation[] = [];
  
  // Try first using the user ID
  if (userId) {
    try {
      const { data, error } = await supabase
        .from('event_reservations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const mappedData = (data as EventReservationRow[]).map(mapRowToEventReservation);
        reservations = [...reservations, ...mappedData];
      }
    } catch (error) {
      console.error('Error fetching event reservations by user_id:', error);
    }
  }
  
  // If an email is available, also search by email
  if (userEmail) {
    try {
      const { data, error } = await supabase
        .from('event_reservations')
        .select('*')
        .eq('guest_email', userEmail)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Avoid duplicates
        const existingIds = new Set(reservations.map(r => r.id));
        const newReservations = (data as EventReservationRow[])
          .filter(item => !existingIds.has(item.id))
          .map(mapRowToEventReservation);
        
        reservations = [...reservations, ...newReservations];
      }
    } catch (error) {
      console.error('Error fetching event reservations by email:', error);
    }
  }

  return reservations;
};
