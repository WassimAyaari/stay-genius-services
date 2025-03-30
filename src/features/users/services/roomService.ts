
import { supabase } from '@/integrations/supabase/client';
import { RoomData } from '../types/userTypes';

/**
 * Synchronise les données de chambre avec Supabase
 */
export const syncRoomData = async (roomNumber: string): Promise<boolean> => {
  if (!roomNumber) return false;
  
  try {
    // Vérifier si la chambre existe déjà
    const { data: existingRoom } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_number', roomNumber)
      .maybeSingle();
    
    if (!existingRoom) {
      // Créer la chambre si elle n'existe pas
      const { error: insertError } = await supabase
        .from('rooms')
        .insert([{
          room_number: roomNumber,
          type: 'standard',
          floor: parseInt(roomNumber.substring(0, 1)) || 1,
          status: 'occupied',
          price: 100,
          capacity: 2,
          amenities: ['wifi', 'tv', 'minibar'],
          images: []
        }]);
      
      if (insertError) throw insertError;
    }
    
    console.log('Room data synchronized with Supabase');
    return true;
  } catch (error) {
    console.error('Error synchronizing room data with Supabase:', error);
    return false;
  }
};

/**
 * Récupère les données d'une chambre depuis Supabase
 */
export const getRoomData = async (roomNumber: string): Promise<RoomData | null> => {
  try {
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_number', roomNumber)
      .maybeSingle();
    
    if (roomError) throw roomError;
    if (!roomData) return null;
    
    return roomData;
  } catch (error) {
    console.error('Error fetching room data from Supabase:', error);
    return null;
  }
};
