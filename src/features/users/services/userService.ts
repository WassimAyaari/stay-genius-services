
import { supabase } from '@/integrations/supabase/client';
import { generateUserId, UserData } from '../types/userTypes';
import { syncRoomData } from './roomService';
import { syncGuestData, getGuestData } from './guestService';
import { syncCompanions } from './companionService';

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
    
    // Vérifier si la chambre existe et la créer si nécessaire
    await syncRoomData(userData.room_number);
    
    // Enregistrer l'utilisateur dans la table guests
    await syncGuestData(userId, userData);
    
    // Si l'utilisateur a des accompagnateurs, les enregistrer également
    if (userData.companions && userData.companions.length > 0) {
      await syncCompanions(userId, userData.companions);
    }
    
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
    // Essayer de récupérer les données de l'invité
    const guestData = await getGuestData(userId);
    
    if (guestData) {
      return guestData;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user data from Supabase:', error);
    return null;
  }
};
