
import { supabase } from '@/integrations/supabase/client';
import { EventReservation, CreateEventReservationDTO, UpdateEventReservationStatusDTO } from '@/types/event';

// Define the Supabase table structure for proper typing
interface EventReservationRow {
  id: string;
  event_id: string;
  user_id: string | null;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  room_number: string | null;
  date: string;
  guests: number;
  special_requests: string | null;
  status: string;
  created_at: string;
}

// Fetch reservations for an event
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
  return data ? (data as EventReservationRow[]).map(item => ({
    id: item.id,
    eventId: item.event_id,
    userId: item.user_id || undefined,
    guestName: item.guest_name || undefined,
    guestEmail: item.guest_email || undefined,
    guestPhone: item.guest_phone || undefined,
    roomNumber: item.room_number || undefined,
    date: item.date,
    guests: item.guests,
    specialRequests: item.special_requests || undefined,
    status: item.status as 'pending' | 'confirmed' | 'cancelled',
    createdAt: item.created_at
  })) : [];
};

// Create a new event reservation
export const createEventReservation = async (reservation: CreateEventReservationDTO): Promise<EventReservation> => {
  console.log('Creating event reservation with data:', reservation);
  
  if (!reservation.eventId) {
    throw new Error('ID d\'événement invalide');
  }
  
  // Verify room number is provided
  if (!reservation.roomNumber) {
    throw new Error('Le numéro de chambre est requis');
  }
  
  // Verify guest name is provided
  if (!reservation.guestName) {
    throw new Error('Le nom est requis');
  }
  
  // Get the current authenticated user from Supabase (if available)
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;
  
  // Create the reservation payload for Supabase format
  const reservationData = {
    event_id: reservation.eventId,
    user_id: userId,
    guest_name: reservation.guestName,
    guest_email: reservation.guestEmail || '',
    guest_phone: reservation.guestPhone || '',
    room_number: reservation.roomNumber,
    date: reservation.date,
    guests: reservation.guests,
    special_requests: reservation.specialRequests || '',
    status: reservation.status || 'pending'
  };
  
  try {
    const { data, error } = await supabase
      .from('event_reservations')
      .insert(reservationData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating event reservation:', error);
      throw new Error(error.message || 'Erreur lors de la création de la réservation');
    }

    if (!data) {
      throw new Error('Aucune donnée retournée lors de la création de la réservation');
    }

    // Properly cast the returned data to our expected structure
    const result = data as unknown as EventReservationRow;
    
    return {
      id: result.id,
      eventId: result.event_id,
      userId: result.user_id || undefined,
      guestName: result.guest_name || undefined,
      guestEmail: result.guest_email || undefined,
      guestPhone: result.guest_phone || undefined,
      roomNumber: result.room_number || undefined,
      date: result.date,
      guests: result.guests,
      specialRequests: result.special_requests || undefined,
      status: result.status as 'pending' | 'confirmed' | 'cancelled',
      createdAt: result.created_at
    };
  } catch (error: any) {
    console.error('Error creating event reservation:', error);
    throw error;
  }
};

// Update event reservation status
export const updateEventReservationStatus = async (data: UpdateEventReservationStatusDTO): Promise<void> => {
  try {
    // Correction : suppression de toute référence à updated_at qui cause l'erreur
    const { error } = await supabase
      .from('event_reservations')
      .update({ status: data.status })
      .eq('id', data.id);
    
    if (error) {
      console.error('Error updating event reservation status:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating event reservation status:', error);
    throw error;
  }
};

// Fetch user's event reservations
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
        const mappedData = (data as EventReservationRow[]).map(item => ({
          id: item.id,
          eventId: item.event_id,
          userId: item.user_id || undefined,
          guestName: item.guest_name || undefined,
          guestEmail: item.guest_email || undefined,
          guestPhone: item.guest_phone || undefined,
          roomNumber: item.room_number || undefined,
          date: item.date,
          guests: item.guests,
          specialRequests: item.special_requests || undefined,
          status: item.status as 'pending' | 'confirmed' | 'cancelled',
          createdAt: item.created_at
        }));
        
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
          .map(item => ({
            id: item.id,
            eventId: item.event_id,
            userId: item.user_id || undefined,
            guestName: item.guest_name || undefined,
            guestEmail: item.guest_email || undefined,
            guestPhone: item.guest_phone || undefined,
            roomNumber: item.room_number || undefined,
            date: item.date,
            guests: item.guests,
            specialRequests: item.special_requests || undefined,
            status: item.status as 'pending' | 'confirmed' | 'cancelled',
            createdAt: item.created_at
          }));
        
        reservations = [...reservations, ...newReservations];
      }
    } catch (error) {
      console.error('Error fetching event reservations by email:', error);
    }
  }

  return reservations;
};
