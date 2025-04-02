
import { supabase } from '@/integrations/supabase/client';
import { cleanupDuplicateGuestRecords as cleanupGuestDuplicates } from './guestCleanupService';

/**
 * Fonction centralisée pour nettoyer les entrées dupliquées pour un utilisateur spécifique
 * dans la table guests. Cette fonction utilise maintenant la méthode dans guestCleanupService.ts.
 * 
 * Note: Cette fonction est maintenue pour la compatibilité avec le code existant.
 * Avec l'utilisation de upsert dans syncGuestData, cette fonction devrait rarement être nécessaire.
 */
export const cleanupDuplicateGuestRecords = async (userId: string): Promise<void> => {
  try {
    // Appeler directement la fonction de nettoyage depuis guestCleanupService
    await cleanupGuestDuplicates(userId);
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
      // Utiliser directement la fonction de nettoyage
      await cleanupDuplicateGuestRecords(session.user.id);
    } else {
      console.log('No active session, skipping cleanup');
    }
  } catch (error) {
    console.error('Error in cleanupDuplicateRecords:', error);
  }
};
