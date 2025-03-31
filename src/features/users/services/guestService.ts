import { supabase } from '@/integrations/supabase/client';
import { GuestData, UserData, CompanionData } from '../types/userTypes';
import { syncCompanions } from './companionService';

/**
 * Synchronise les données d'invité avec Supabase
 */
export const syncGuestData = async (userId: string, userData: UserData): Promise<boolean> => {
  try {
    console.log('Syncing guest data for user:', userId);
    
    // Vérifier si l'invité existe déjà
    const { data: existingGuest } = await supabase
      .from('guests')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    // Préparer les données à insérer ou mettre à jour 
    const guestData: GuestData = {
      user_id: userId,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      room_number: userData.room_number,
      phone: userData.phone,
      // Safely convert date objects to ISO strings or pass strings as is
      check_in_date: userData.check_in_date ? 
        (userData.check_in_date instanceof Date ? 
          userData.check_in_date.toISOString().split('T')[0] : 
          typeof userData.check_in_date === 'string' ? 
            userData.check_in_date : 
            undefined) : 
        undefined,
      check_out_date: userData.check_out_date ? 
        (userData.check_out_date instanceof Date ? 
          userData.check_out_date.toISOString().split('T')[0] : 
          typeof userData.check_out_date === 'string' ? 
            userData.check_out_date : 
            undefined) : 
        undefined,
      birth_date: userData.birth_date ? 
        (userData.birth_date instanceof Date ? 
          userData.birth_date.toISOString().split('T')[0] : 
          typeof userData.birth_date === 'string' ? 
            userData.birth_date : 
            undefined) : 
        undefined,
      nationality: userData.nationality,
      profile_image: userData.profile_image,
      guest_type: 'Premium Guest', // Tous les invités seront considérés comme Premium Guest
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
export const getGuestData = async (userId: string): Promise<UserData | null> => {
  try {
    console.log('Fetching guest data from Supabase for user:', userId);
    
    const { data: guestData, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (guestError) {
      console.error('Error fetching guest data:', guestError);
      throw guestError;
    }
    
    if (guestData) {
      console.log('Guest data found in Supabase:', guestData);
      
      // Construire l'objet UserData à partir des données de l'invité
      const userData: UserData = {
        id: userId,
        email: guestData.email || '',
        first_name: guestData.first_name || '',
        last_name: guestData.last_name || '',
        room_number: guestData.room_number || '',
        phone: guestData.phone,
        // Keep the dates as strings to avoid conversion issues
        birth_date: guestData.birth_date || undefined,
        nationality: guestData.nationality,
        check_in_date: guestData.check_in_date || undefined,
        check_out_date: guestData.check_out_date || undefined,
        profile_image: guestData.profile_image,
      };
      
      // Récupérer et ajouter les accompagnateurs
      try {
        const companions = await getCompanionsForUser(userId);
        if (companions && companions.length > 0) {
          userData.companions = companions;
        }
      } catch (compError) {
        console.error('Error fetching companions:', compError);
      }
      
      return userData;
    }
    
    console.log('No guest data found in Supabase for user:', userId);
    return null;
  } catch (error) {
    console.error('Error fetching guest data from Supabase:', error);
    return null;
  }
};

// Fonction auxiliaire pour récupérer les accompagnateurs
const getCompanionsForUser = async (userId: string): Promise<CompanionData[]> => {
  try {
    const { data, error } = await supabase
      .from('companions')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map(comp => ({
        id: comp.id,
        user_id: comp.user_id,
        first_name: comp.first_name,
        last_name: comp.last_name,
        relation: comp.relation,
        birthDate: comp.birth_date
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching companions for user:', error);
    return [];
  }
};
