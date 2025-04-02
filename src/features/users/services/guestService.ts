
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '../types/userTypes';
import { formatDateToString, isValidUuid } from '../utils/validationUtils';

/**
 * Récupère les données d'un invité depuis Supabase
 */
export const getGuestData = async (userId: string): Promise<UserData | null> => {
  try {
    console.log('Fetching guest data for user ID:', userId);
    
    // Vérifier si l'UUID est valide
    if (!isValidUuid(userId)) {
      console.error('Invalid user ID format:', userId);
      return null;
    }
    
    // Récupérer tous les enregistrements pour vérifier s'il y a des doublons
    const { data: allRecords, error: recordsError } = await supabase
      .from('guests')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (recordsError) {
      console.error('Error checking for duplicate records:', recordsError);
    } else if (allRecords && allRecords.length > 1) {
      // S'il y a des doublons, nettoyer
      console.log(`Found ${allRecords.length} records for user ${userId}, cleaning up duplicates`);
      await cleanupDuplicateGuestRecords(userId);
    }
    
    // Maintenant récupérer l'enregistrement le plus récent
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching guest data:', error);
      return null;
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
 * Utilise un INSERT avec ON CONFLICT pour éviter les doublons
 */
export const syncGuestData = async (userId: string, userData: UserData): Promise<boolean> => {
  try {
    console.log('Syncing guest data for user ID:', userId);
    
    // Vérifier si l'UUID est valide
    if (!isValidUuid(userId)) {
      console.error('Invalid user ID format:', userId);
      return false;
    }
    
    // Préparer les données avec les dates correctement formatées
    const guestData = {
      user_id: userId,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      room_number: userData.room_number || '',
      birth_date: formatDateToString(userData.birth_date),
      nationality: userData.nationality,
      check_in_date: formatDateToString(userData.check_in_date),
      check_out_date: formatDateToString(userData.check_out_date),
      profile_image: userData.profile_image,
      phone: userData.phone,
      guest_type: userData.guest_type || 'Standard Guest'
    };
    
    // D'abord vérifier si l'enregistrement existe déjà
    const { data: existingGuest, error: checkError } = await supabase
      .from('guests')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing guest:', checkError);
    }
    
    let result;
    if (existingGuest) {
      // Mettre à jour l'enregistrement existant
      console.log('Updating existing guest record with ID:', existingGuest.id);
      result = await supabase
        .from('guests')
        .update(guestData)
        .eq('id', existingGuest.id);
    } else {
      // Insérer un nouvel enregistrement
      console.log('Creating new guest record');
      result = await supabase
        .from('guests')
        .insert([guestData]);
    }
    
    const { error } = result;
    
    if (error) {
      console.error('Error syncing guest data:', error);
      return false;
    }
    
    console.log('Guest data synchronized successfully for user ID:', userId);
    
    // Si l'opération a réussi, s'assurer que localStorage est à jour
    localStorage.setItem('user_data', JSON.stringify(userData));
    if (userData.room_number) {
      localStorage.setItem('user_room_number', userData.room_number);
    }
    
    return true;
  } catch (error) {
    console.error('Exception when syncing guest data:', error);
    return false;
  }
};

/**
 * Nettoie les doublons potentiels dans la table des invités
 */
export const cleanupDuplicateGuestRecords = async (userId: string): Promise<boolean> => {
  try {
    // Vérifier si l'UUID est valide
    if (!isValidUuid(userId)) {
      console.error('Invalid user ID format:', userId);
      return false;
    }
    
    // Récupérer tous les enregistrements pour cet utilisateur
    const { data, error } = await supabase
      .from('guests')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching guest records for cleanup:', error);
      return false;
    }
    
    // S'il n'y a pas plus d'un enregistrement, pas besoin de nettoyage
    if (!data || data.length <= 1) {
      return true;
    }
    
    console.log(`Cleaning up ${data.length - 1} duplicate guest records for user ID:`, userId);
    
    // Garder le premier enregistrement (le plus récent) et supprimer les autres
    const recordsToDelete = data.slice(1).map(record => record.id);
    
    if (recordsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('guests')
        .delete()
        .in('id', recordsToDelete);
      
      if (deleteError) {
        console.error('Error deleting duplicate guest records:', deleteError);
        return false;
      }
      
      console.log(`Successfully cleaned up duplicate records for user ID: ${userId}`);
    }
    
    return true;
  } catch (error) {
    console.error('Exception during guest records cleanup:', error);
    return false;
  }
};
