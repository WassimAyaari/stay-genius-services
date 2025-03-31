
import { supabase } from '@/integrations/supabase/client';
import { TableReservation, CreateTableReservationDTO, UpdateReservationStatusDTO } from '@/features/dining/types';

// Define the shape of the data returned from Supabase
interface SupabaseTableReservation {
  id: string;
  restaurant_id: string;
  user_id: string | null;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  room_number: string | null;
  date: string;
  time: string;
  guests: number;
  menu_id: string | null;
  special_requests: string | null;
  status: string;
  created_at: string;
}

// Fetch reservations for a restaurant
export const fetchReservations = async (restaurantId?: string): Promise<TableReservation[]> => {
  let query = supabase
    .from('table_reservations')
    .select('*')
    .order('date', { ascending: true })
    .order('time', { ascending: true });
  
  if (restaurantId && restaurantId !== ':id') {
    query = query.eq('restaurant_id', restaurantId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }

  // Utiliser une assertion de type pour éviter l'erreur
  return (data as unknown as SupabaseTableReservation[]).map(item => ({
    id: item.id,
    restaurantId: item.restaurant_id,
    userId: item.user_id || undefined,
    guestName: item.guest_name || undefined,
    guestEmail: item.guest_email || undefined,
    guestPhone: item.guest_phone || undefined,
    roomNumber: item.room_number || '',
    date: item.date,
    time: item.time,
    guests: item.guests,
    menuId: item.menu_id || undefined,
    specialRequests: item.special_requests || undefined,
    status: item.status as 'pending' | 'confirmed' | 'cancelled',
    createdAt: item.created_at
  }));
};

// Create a new reservation
export const createReservation = async (reservation: CreateTableReservationDTO): Promise<TableReservation> => {
  if (!reservation.restaurantId || reservation.restaurantId === ':id') {
    throw new Error('Invalid restaurant ID');
  }
  
  // Get the current authenticated user from Supabase
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;
  
  // Si pas de numéro de chambre fourni, lever une erreur explicite
  if (!reservation.roomNumber) {
    throw new Error('Room number is required to create a reservation.');
  }
  
  // Si userId est disponible, récupérer les données utilisateur depuis la table guests
  let roomNumber = reservation.roomNumber || '';
  let guestName = reservation.guestName || '';
  let guestEmail = reservation.guestEmail || '';
  let guestPhone = reservation.guestPhone || '';
  
  if (userId) {
    try {
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (!guestError && guestData) {
        // Utiliser les données de la table guests si disponibles
        roomNumber = roomNumber || guestData.room_number || '';
        guestName = guestName || `${guestData.first_name} ${guestData.last_name}`.trim();
        guestEmail = guestEmail || guestData.email || '';
        guestPhone = guestPhone || guestData.phone || '';
      }
    } catch (error) {
      console.error('Error fetching guest data for reservation:', error);
    }
  }
  
  // Vérifions à nouveau si nous avons un numéro de chambre
  if (!roomNumber) {
    throw new Error('Unable to create reservation. Please make sure you have provided your room number.');
  }
  
  // Create the reservation payload - ensure all required fields are included
  const reservationData = {
    restaurant_id: reservation.restaurantId,
    user_id: userId,
    guest_name: guestName,
    guest_email: guestEmail,
    guest_phone: guestPhone,
    room_number: roomNumber,
    date: reservation.date,
    time: reservation.time,
    guests: reservation.guests,
    menu_id: reservation.menuId || null,
    special_requests: reservation.specialRequests || '',
    status: reservation.status || 'pending'
  };
  
  console.log('Creating reservation with data:', reservationData);
  
  try {
    const { data, error } = await supabase
      .from('table_reservations')
      .insert(reservationData)
      .select()
      .single();

    if (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }

    // Utiliser une assertion de type pour éviter l'erreur
    const typedData = data as unknown as SupabaseTableReservation;
    return {
      id: typedData.id,
      restaurantId: typedData.restaurant_id,
      userId: typedData.user_id || undefined,
      guestName: typedData.guest_name || undefined,
      guestEmail: typedData.guest_email || undefined,
      guestPhone: typedData.guest_phone || undefined,
      roomNumber: typedData.room_number || '',
      date: typedData.date,
      time: typedData.time,
      guests: typedData.guests,
      menuId: typedData.menu_id || undefined,
      specialRequests: typedData.special_requests || undefined,
      status: typedData.status as 'pending' | 'confirmed' | 'cancelled',
      createdAt: typedData.created_at
    };
  } catch (error) {
    console.error('Failed to create reservation:', error);
    throw new Error('Unable to create reservation. Please make sure you are logged in and have provided your room number.');
  }
};

// Update reservation status
export const updateReservationStatus = async ({ id, status }: UpdateReservationStatusDTO): Promise<void> => {
  const { error } = await supabase
    .from('table_reservations')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating reservation status:', error);
    throw error;
  }
};
