
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
  room_number?: string | null;
  date: string;
  time: string;
  guests: number;
  menu_id?: string | null;
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

  return (data as SupabaseTableReservation[]).map(item => ({
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
  
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;
  
  try {
    const { data, error } = await supabase
      .from('table_reservations')
      .insert({
        restaurant_id: reservation.restaurantId,
        user_id: userId,
        guest_name: reservation.guestName,
        guest_email: reservation.guestEmail,
        guest_phone: reservation.guestPhone,
        room_number: reservation.roomNumber,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        menu_id: reservation.menuId,
        special_requests: reservation.specialRequests,
        status: reservation.status
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }

    const typedData = data as SupabaseTableReservation;
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
    console.error('Failed to create reservation, trying alternative approach:', error);
    
    try {
      const { data, error: directError } = await supabase
        .from('table_reservations')
        .insert({
          restaurant_id: reservation.restaurantId,
          guest_name: reservation.guestName,
          guest_email: reservation.guestEmail,
          guest_phone: reservation.guestPhone,
          room_number: reservation.roomNumber,
          date: reservation.date,
          time: reservation.time,
          guests: reservation.guests,
          menu_id: reservation.menuId,
          special_requests: reservation.specialRequests || '',
          status: reservation.status
        })
        .select()
        .single();
        
      if (directError) {
        throw directError;
      }
      
      const typedData = data as SupabaseTableReservation;
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
    } catch (directError) {
      console.error('Both reservation methods failed:', directError);
      throw new Error('Unable to create reservation due to permission restrictions');
    }
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
