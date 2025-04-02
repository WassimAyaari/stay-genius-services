
import { supabase } from '@/integrations/supabase/client';

/**
 * Nettoie toutes les entrées dupliquées pour un utilisateur spécifique
 * dans la table guests
 */
export const cleanupDuplicateGuestRecords = async (userId: string): Promise<void> => {
  try {
    // Obtenir toutes les entrées pour cet utilisateur
    const { data: duplicates, error: fetchError } = await supabase
      .from('guests')
      .select('id')
      .eq('user_id', userId);
      
    if (fetchError) {
      console.error('Error fetching duplicate records:', fetchError);
      return;
    }
    
    // S'il y a plus d'une entrée, conserver la plus récente et supprimer les autres
    if (duplicates && duplicates.length > 1) {
      console.log(`Found ${duplicates.length} duplicate records for user ${userId}, cleaning up...`);
      
      // Récupérer l'ID de l'entrée la plus récente
      const { data: latestRecord, error: latestError } = await supabase
        .from('guests')
        .select('id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (latestError || !latestRecord) {
        console.error('Error finding latest record:', latestError);
        return;
      }
      
      // Supprimer toutes les autres entrées sauf la plus récente
      const { error: deleteError } = await supabase
        .from('guests')
        .delete()
        .eq('user_id', userId)
        .neq('id', latestRecord.id);
        
      if (deleteError) {
        console.error('Error deleting duplicate records:', deleteError);
        return;
      }
      
      console.log(`Successfully cleaned up duplicate records for user ${userId}`);
    }
  } catch (error) {
    console.error('Error in cleanupDuplicateGuestRecords:', error);
  }
};

/**
 * Utilitaire pour nettoyer plusieurs types de données dupliquées
 */
export const cleanupDuplicateRecords = async (): Promise<void> => {
  try {
    // Récupérer la session utilisateur actuelle
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user?.id) {
      await cleanupDuplicateGuestRecords(session.user.id);
    } else {
      console.log('No active session, skipping cleanup');
    }
  } catch (error) {
    console.error('Error in cleanupDuplicateRecords:', error);
  }
};
