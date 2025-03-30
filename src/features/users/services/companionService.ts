
import { supabase } from '@/integrations/supabase/client';
import { CompanionData } from '../types/userTypes';

/**
 * Synchronise les accompagnateurs de l'utilisateur
 */
export const syncCompanions = async (userId: string, companions: CompanionData[]): Promise<boolean> => {
  try {
    // D'abord supprimer tous les accompagnateurs existants
    const { error: deleteError } = await supabase
      .from('companions')
      .delete()
      .eq('user_id', userId);
    
    if (deleteError) {
      console.error('Error deleting companions:', deleteError);
      throw deleteError;
    }
    
    // Préparer les données des accompagnateurs
    const companionsData = companions.map(companion => ({
      user_id: userId,
      first_name: companion.first_name || companion.firstName,
      last_name: companion.last_name || companion.lastName,
      relation: companion.relation
    }));
    
    // Insérer les nouveaux accompagnateurs
    if (companionsData.length > 0) {
      const { error: insertError } = await supabase
        .from('companions')
        .insert(companionsData);
      
      if (insertError) {
        console.error('Error inserting companions:', insertError);
        throw insertError;
      }
    }
    
    console.log('Companions synchronized with Supabase');
    return true;
  } catch (error) {
    console.error('Error synchronizing companions with Supabase:', error);
    return false;
  }
};

/**
 * Récupère les accompagnateurs d'un utilisateur depuis Supabase
 */
export const getCompanions = async (userId: string): Promise<CompanionData[]> => {
  try {
    const { data: companions, error } = await supabase
      .from('companions')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return companions || [];
  } catch (error) {
    console.error('Error fetching companions from Supabase:', error);
    return [];
  }
};
