
import { supabase } from '@/integrations/supabase/client';
import { validateGuestId, logGuestOperation } from './guestValidation';

/**
 * Nettoie les doublons potentiels dans la table des invités
 * Cette fonction conserve l'enregistrement le plus récent et supprime les autres
 */
export const cleanupDuplicateGuestRecords = async (userId: string): Promise<boolean> => {
  try {
    // Vérifier si l'UUID est valide
    if (!validateGuestId(userId)) {
      console.error('Invalid user ID format for cleanup:', userId);
      return false;
    }
    
    // Récupérer tous les enregistrements pour cet utilisateur
    const { data, error } = await supabase
      .from('guests')
      .select('id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching guest records for cleanup:', error);
      return false;
    }
    
    // S'il n'y a pas plus d'un enregistrement, pas besoin de nettoyage
    if (!data || data.length <= 1) {
      console.log(`No duplicates found for user ID: ${userId}`);
      return true;
    }
    
    console.log(`Found ${data.length} records for user ID: ${userId}, keeping most recent and removing ${data.length - 1} duplicates`);
    
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
      
      console.log(`Successfully cleaned up ${recordsToDelete.length} duplicate records for user ID: ${userId}`);
    }
    
    return true;
  } catch (error) {
    console.error('Exception during guest records cleanup:', error);
    return false;
  }
};
