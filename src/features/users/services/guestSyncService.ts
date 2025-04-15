
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '../types/userTypes';
import { formatDateToString } from '../utils/validationUtils';
import { validateGuestId, logGuestOperation } from './guestValidation';

/**
 * Synchronise les données d'un invité avec Supabase
 * Utilise un UPSERT pour éviter les doublons
 */
export const syncGuestData = async (userId: string, userData: UserData): Promise<boolean> => {
  try {
    console.log('Syncing guest data for user ID:', userId);
    
    // Vérifier si l'UUID est valide
    if (!validateGuestId(userId)) {
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
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing guest:', checkError);
    }
    
    let result;
    if (existingGuest) {
      // Mettre à jour l'enregistrement existant le plus récent
      console.log('Updating existing guest record with ID:', existingGuest.id);
      result = await supabase
        .from('guests')
        .update(guestData)
        .eq('id', existingGuest.id);
      
      // Nettoyer les autres enregistrements s'il y en a
      await cleanupDuplicateGuestRecords(userId);
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
    
    // Après synchronisation réussie, garantir qu'il n'y a pas de doublons
    await cleanupDuplicateGuestRecords(userId);
    
    return true;
  } catch (error) {
    console.error('Exception when syncing guest data:', error);
    return false;
  }
};

// Re-export the cleanupDuplicateGuestRecords for convenience
export { cleanupDuplicateGuestRecords } from './guestCleanupService';
