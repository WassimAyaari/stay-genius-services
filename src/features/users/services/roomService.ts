
import { supabase } from '@/integrations/supabase/client';
import { RoomData } from '../types/userTypes';
import { RoomType } from '@/features/types/supabaseTypes';

/**
 * Synchronise les données de chambre avec Supabase
 */
export const syncRoomData = async (roomNumber: string): Promise<boolean> => {
  try {
    if (!roomNumber) return false;
    
    // Vérifier si la chambre existe déjà
    const { data: existingRoom } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_number', roomNumber)
      .maybeSingle();
    
    if (existingRoom) {
      console.log('Room already exists:', existingRoom);
      return true;
    }
    
    // Créer une nouvelle chambre
    const roomData = [{
      room_number: roomNumber,
      type: 'Luxury Suite',
      floor: parseInt(roomNumber.substring(0, 1), 10) || 1,
      status: 'occupied',
      price: 250,
      capacity: 2,
      amenities: ['wifi', 'tv', 'minibar', 'air_conditioning'],
      images: []
    }];
    
    const { error: insertError } = await supabase
      .from('rooms')
      .insert(roomData);
    
    if (insertError) {
      console.error('Error inserting room:', insertError);
      throw insertError;
    }
    
    console.log('Room data synchronized with Supabase');
    return true;
  } catch (error) {
    console.error('Error synchronizing room data with Supabase:', error);
    return false;
  }
};

/**
 * Récupère les données de chambre depuis Supabase
 */
export const getRoomData = async (roomNumber: string): Promise<RoomData | null> => {
  try {
    const { data } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_number', roomNumber)
      .maybeSingle();
    
    if (data) {
      const roomData: RoomData = {
        room_number: data.room_number,
        type: data.type,
        floor: data.floor,
        status: data.status,
        price: data.price,
        capacity: data.capacity,
        amenities: data.amenities,
        images: data.images
      };
      
      return roomData;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching room data from Supabase:', error);
    return null;
  }
};
