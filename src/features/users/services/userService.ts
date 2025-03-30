
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface UserData {
  id?: string;
  email: string;
  first_name: string;
  last_name: string;
  room_number: string;
  birth_date?: Date;
  nationality?: string;
  check_in_date?: Date;
  check_out_date?: Date;
  profile_image?: string;
  companions?: any[];
}

/**
 * Synchronise les données utilisateur avec Supabase
 */
export const syncUserData = async (userData: UserData): Promise<boolean> => {
  try {
    // Récupérer l'ID utilisateur du localStorage ou en générer un nouveau
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('user_id', userId);
    }
    
    // Vérifier si le profil existe déjà
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    // Préparer les données à insérer ou mettre à jour
    const profileData = {
      id: userId,
      first_name: userData.first_name,
      last_name: userData.last_name,
      // Note: email is not stored in profiles table based on Supabase schema
      phone: null
    };
    
    if (existingProfile) {
      // Mettre à jour le profil existant
      const { error: updateError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId);
      
      if (updateError) throw updateError;
    } else {
      // Créer un nouveau profil
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([profileData]);
      
      if (insertError) throw insertError;
    }
    
    // Vérifier si la chambre existe et la créer si nécessaire
    await syncRoomData(userData.room_number);
    
    console.log('User data synchronized with Supabase');
    return true;
  } catch (error) {
    console.error('Error synchronizing user data with Supabase:', error);
    return false;
  }
};

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
 * Récupère les données utilisateur depuis Supabase
 */
export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) throw error;
    if (!data) return null;
    
    // Construire l'objet UserData à partir des données du profil
    // Note: email is not part of profiles table, so we can't get it from there
    const userData: UserData = {
      id: data.id,
      email: '', // The profiles table doesn't have an email field, so we use an empty string
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      room_number: '' // Nous devrons récupérer cette information ailleurs
    };
    
    return userData;
  } catch (error) {
    console.error('Error fetching user data from Supabase:', error);
    return null;
  }
};
