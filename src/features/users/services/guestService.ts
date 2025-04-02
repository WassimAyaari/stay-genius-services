
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '../types/userTypes';

/**
 * Récupère les données d'un invité depuis Supabase
 */
export const getGuestData = async (userId: string): Promise<UserData | null> => {
  try {
    console.log('Fetching guest data for user ID:', userId);
    
    // Vérifier si l'UUID est valide
    if (!userId || !userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.error('Invalid user ID format:', userId);
      return null;
    }
    
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {  // Code pour "No rows returned"
        console.log('No guest data found for user ID:', userId);
        return null;
      } else {
        console.error('Error fetching guest data:', error);
        return null;
      }
    }
    
    if (!data) {
      console.log('No guest data returned for user ID:', userId);
      return null;
    }
    
    console.log('Guest data retrieved successfully:', data);
    
    const userData: UserData = {
      id: data.user_id,
      email: data.email || '',
      first_name: data.first_name || 'Utilisateur',
      last_name: data.last_name || '',
      room_number: data.room_number || '',
      birth_date: data.birth_date,
      nationality: data.nationality,
      check_in_date: data.check_in_date,
      check_out_date: data.check_out_date,
      profile_image: data.profile_image,
      phone: data.phone,
      guest_type: data.guest_type || 'Standard Guest'
    };
    
    return userData;
  } catch (error) {
    console.error('Exception when fetching guest data:', error);
    return null;
  }
};

/**
 * Synchronise les données d'un invité avec Supabase
 */
export const syncGuestData = async (userId: string, userData: UserData): Promise<boolean> => {
  try {
    console.log('Syncing guest data for user ID:', userId);
    
    // Vérifier si l'UUID est valide
    if (!userId || !userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.error('Invalid user ID format:', userId);
      return false;
    }
    
    // Vérifier si l'invité existe déjà
    const { data: existingGuest, error: checkError } = await supabase
      .from('guests')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing guest:', checkError);
      return false;
    }
    
    if (existingGuest) {
      // Mettre à jour l'invité existant
      console.log('Updating existing guest record for user ID:', userId);
      
      const { error: updateError } = await supabase
        .from('guests')
        .update({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          room_number: userData.room_number,
          birth_date: userData.birth_date,
          nationality: userData.nationality,
          check_in_date: userData.check_in_date,
          check_out_date: userData.check_out_date,
          profile_image: userData.profile_image,
          phone: userData.phone,
          guest_type: userData.guest_type || 'Standard Guest'
        })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('Error updating guest data:', updateError);
        return false;
      }
    } else {
      // Créer un nouvel invité
      console.log('Creating new guest record for user ID:', userId);
      
      const { error: insertError } = await supabase
        .from('guests')
        .insert({
          user_id: userId,
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          room_number: userData.room_number,
          birth_date: userData.birth_date,
          nationality: userData.nationality,
          check_in_date: userData.check_in_date,
          check_out_date: userData.check_out_date,
          profile_image: userData.profile_image,
          phone: userData.phone,
          guest_type: userData.guest_type || 'Standard Guest'
        });
      
      if (insertError) {
        console.error('Error inserting guest data:', insertError);
        return false;
      }
    }
    
    console.log('Guest data synchronized successfully for user ID:', userId);
    return true;
  } catch (error) {
    console.error('Exception when syncing guest data:', error);
    return false;
  }
};

/**
 * Nettoyer les doublons potentiels dans la table des invités
 */
export const cleanupDuplicateGuestRecords = async (userId: string): Promise<boolean> => {
  try {
    // Vérifier si l'UUID est valide
    if (!userId || !userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.error('Invalid user ID format:', userId);
      return false;
    }
    
    const { data, error } = await supabase
      .from('guests')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching guest records for cleanup:', error);
      return false;
    }
    
    if (!data || data.length <= 1) {
      // Pas de doublons à nettoyer
      return true;
    }
    
    // Garder le premier enregistrement (le plus récent) et supprimer les autres
    const recordsToDelete = data.slice(1).map(record => record.id);
    
    if (recordsToDelete.length > 0) {
      console.log(`Cleaning up ${recordsToDelete.length} duplicate guest records for user ID:`, userId);
      
      const { error: deleteError } = await supabase
        .from('guests')
        .delete()
        .in('id', recordsToDelete);
      
      if (deleteError) {
        console.error('Error deleting duplicate guest records:', deleteError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Exception during guest records cleanup:', error);
    return false;
  }
};
