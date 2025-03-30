
import { supabase } from '@/integrations/supabase/client';
import { GuestData, UserData } from '../types/userTypes';
import { syncCompanions } from './companionService';

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
    const guestData: GuestData = {
      user_id: userId,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      room_number: userData.room_number,
      check_in_date: userData.check_in_date ? userData.check_in_date.toISOString() : undefined,
      check_out_date: userData.check_out_date ? userData.check_out_date.toISOString() : undefined,
      birth_date: userData.birth_date ? userData.birth_date.toISOString() : undefined,
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
 * Récupère les données d'invité depuis Supabase
 */
export const getGuestData = async (userId: string): Promise<UserData | null> => {
  try {
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
    
    return null;
  } catch (error) {
    console.error('Error fetching guest data from Supabase:', error);
    return null;
  }
};
