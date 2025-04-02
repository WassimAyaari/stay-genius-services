
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '../types/userTypes';
import { validateGuestId, logGuestOperation } from './guestValidation';
import { cleanupDuplicateGuestRecords } from './guestCleanupService';

/**
 * Récupère les données d'un invité depuis Supabase
 */
export const getGuestData = async (userId: string): Promise<UserData | null> => {
  try {
    console.log('Fetching guest data for user ID:', userId);
    
    // Vérifier si l'UUID est valide
    if (!validateGuestId(userId)) {
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
