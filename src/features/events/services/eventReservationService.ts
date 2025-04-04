
import { supabase } from '@/integrations/supabase/client';
import { EventReservation, CreateEventReservationDTO, UpdateEventReservationStatusDTO } from '@/types/event';

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
  return data ? data.map(item => ({
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
    // Use 'any' type to avoid TypeScript errors with the new table
    const { data, error } = await supabase
      .from('event_reservations' as any)
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

    return {
      id: data.id,
      eventId: data.event_id,
      userId: data.user_id || undefined,
      guestName: data.guest_name || undefined,
      guestEmail: data.guest_email || undefined,
      guestPhone: data.guest_phone || undefined,
      roomNumber: data.room_number || undefined,
      date: data.date,
      guests: data.guests,
      specialRequests: data.special_requests || undefined,
      status: data.status as 'pending' | 'confirmed' | 'cancelled',
      createdAt: data.created_at
    };
  } catch (error: any) {
    console.error('Error creating event reservation:', error);
    throw error;
  }
};

// Update event reservation status
export const updateEventReservationStatus = async (data: UpdateEventReservationStatusDTO): Promise<void> => {
  try {
    const { error } = await supabase
      .from('event_reservations' as any)
      .update({ status: data.status })
      .eq('id', data.id);
    
    if (error) throw error;
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
        .from('event_reservations' as any)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const mappedData = data.map(item => ({
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
        .from('event_reservations' as any)
        .select('*')
        .eq('guest_email', userEmail)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Avoid duplicates
        const existingIds = new Set(reservations.map(r => r.id));
        const newReservations = data
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
