
import { supabase } from '@/integrations/supabase/client';
import { generateUserId, UserData } from '../types/userTypes';
import { syncProfileData } from './profileService';
import { syncRoomData } from './roomService';
import { syncGuestData, getGuestData } from './guestService';
import { getProfileData } from './profileService';

/**
 * Synchronise les données utilisateur avec Supabase
 */
export const syncUserData = async (userData: UserData): Promise<boolean> => {
  try {
    console.log('Syncing user data:', userData);
    
    // Récupérer l'ID utilisateur du localStorage ou en générer un nouveau
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = generateUserId();
      localStorage.setItem('user_id', userId);
    }
    
    // Préparer les données à insérer ou mettre à jour
    const profileData = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone: null
    };
    
    // Synchroniser le profil
    const profileSuccess = await syncProfileData(userId, profileData);
    if (!profileSuccess) {
      throw new Error('Failed to synchronize profile data');
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
 * Récupère les données utilisateur depuis Supabase
 */
export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    // D'abord essayer de récupérer les données de l'invité
    const guestData = await getGuestData(userId);
    
    if (guestData) {
      return guestData;
    }
    
    // Sinon, essayer de récupérer les données du profil
    const profileData = await getProfileData(userId);
    
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
