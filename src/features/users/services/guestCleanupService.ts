
import { supabase } from '@/integrations/supabase/client';
import { validateGuestId, logGuestOperation } from './guestValidation';

/**
 * Nettoie les doublons potentiels dans la table des invités
 */
export const cleanupDuplicateGuestRecords = async (userId: string): Promise<boolean> => {
  try {
    // Vérifier si l'UUID est valide
    if (!validateGuestId(userId)) {
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
