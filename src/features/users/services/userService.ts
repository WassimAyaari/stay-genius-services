
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
    console.log('Syncing user data:', userData);
    
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
      phone: null
    };
    
    console.log('Existing profile:', existingProfile);
    console.log('Profile data to save:', profileData);
    
    if (existingProfile) {
      // Mettre à jour le profil existant
      const { error: updateError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId);
      
      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }
    } else {
      // Créer un nouveau profil
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([profileData]);
      
      if (insertError) {
        console.error('Error inserting profile:', insertError);
        throw insertError;
      }
    }
    
    // Vérifier si la chambre existe et la créer si nécessaire
    await syncRoomData(userData.room_number);
    
    // Enregistrer l'utilisateur dans la table guests
    await syncGuestData(userId, userData);
    
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
 * Synchronise les données d'invité avec Supabase
 */
export const syncGuestData = async (userId: string, userData: UserData): Promise<boolean> => {
  try {
    // Vérifier si l'invité existe déjà
    const { data: existingGuest } = await supabase
      .from('guests')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    // Préparer les données à insérer ou mettre à jour - Convert Date objects to ISO strings
    const guestData = {
      user_id: userId,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      room_number: userData.room_number,
      check_in_date: userData.check_in_date ? userData.check_in_date.toISOString() : null,
      check_out_date: userData.check_out_date ? userData.check_out_date.toISOString() : null,
      birth_date: userData.birth_date ? userData.birth_date.toISOString() : null,
      nationality: userData.nationality,
      guest_type: 'Premium Guest' // Tous les invités seront considérés comme Premium Guest
    };
    
    console.log('Guest data to save:', guestData);
    
    if (existingGuest) {
      // Mettre à jour l'invité existant
      const { error: updateError } = await supabase
        .from('guests')
        .update(guestData)
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('Error updating guest:', updateError);
        throw updateError;
      }
    } else {
      // Créer un nouvel invité
      const { error: insertError } = await supabase
        .from('guests')
        .insert([guestData]);
      
      if (insertError) {
        console.error('Error inserting guest:', insertError);
        throw insertError;
      }
    }
    
    // Si l'utilisateur a des accompagnateurs, les enregistrer également
    if (userData.companions && userData.companions.length > 0) {
      await syncCompanions(userId, userData.companions);
    }
    
    console.log('Guest data synchronized with Supabase');
    return true;
  } catch (error) {
    console.error('Error synchronizing guest data with Supabase:', error);
    return false;
  }
};

/**
 * Récupère les données utilisateur depuis Supabase
 */
export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    // D'abord essayer de récupérer les données de l'invité
    const { data: guestData, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (guestError) throw guestError;
    
    if (guestData) {
      // Construire l'objet UserData à partir des données de l'invité
      const userData: UserData = {
        id: userId,
        email: guestData.email || '',
        first_name: guestData.first_name || '',
        last_name: guestData.last_name || '',
        room_number: guestData.room_number || '',
        // Convert string dates back to Date objects if they exist
        birth_date: guestData.birth_date ? new Date(guestData.birth_date) : undefined,
        nationality: guestData.nationality,
        check_in_date: guestData.check_in_date ? new Date(guestData.check_in_date) : undefined,
        check_out_date: guestData.check_out_date ? new Date(guestData.check_out_date) : undefined
      };
      
      return userData;
    }
    
    // Sinon, essayer de récupérer les données du profil
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (profileError) throw profileError;
    if (!profileData) return null;
    
    // Construire l'objet UserData à partir des données du profil
    const userData: UserData = {
      id: profileData.id,
      email: '', // The profiles table doesn't have an email field, so we use an empty string
      first_name: profileData.first_name || '',
      last_name: profileData.last_name || '',
      room_number: '' // Nous devrons récupérer cette information ailleurs
    };
    
    return userData;
  } catch (error) {
    console.error('Error fetching user data from Supabase:', error);
    return null;
  }
};

/**
 * Synchronise les accompagnateurs de l'utilisateur
 */
const syncCompanions = async (userId: string, companions: any[]): Promise<boolean> => {
  try {
    // D'abord supprimer tous les accompagnateurs existants
    const { error: deleteError } = await supabase
      .from('companions')
      .delete()
      .eq('user_id', userId);
    
    if (deleteError) {
      console.error('Error deleting companions:', deleteError);
      throw deleteError;
    }
    
    // Préparer les données des accompagnateurs
    const companionsData = companions.map(companion => ({
      user_id: userId,
      first_name: companion.firstName || companion.first_name,
      last_name: companion.lastName || companion.last_name,
      relation: companion.relation
    }));
    
    // Insérer les nouveaux accompagnateurs
    if (companionsData.length > 0) {
      const { error: insertError } = await supabase
        .from('companions')
        .insert(companionsData);
      
      if (insertError) {
        console.error('Error inserting companions:', insertError);
        throw insertError;
      }
    }
    
    console.log('Companions synchronized with Supabase');
    return true;
  } catch (error) {
    console.error('Error synchronizing companions with Supabase:', error);
    return false;
  }
};
