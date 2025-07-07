
import { supabase } from '@/integrations/supabase/client';
import { CompanionData } from '../types/userTypes';
import { CompanionType } from '@/features/types/supabaseTypes';

/**
 * Synchronise les données des accompagnateurs avec Supabase
 */
export const syncCompanions = async (userId: string, companions: CompanionData[]): Promise<boolean> => {
  try {
    // Récupérer les accompagnateurs existants
    const { data: existingCompanions, error: fetchError } = await supabase
      .from('companions')
      .select('*')
      .eq('user_id', userId);
    
    if (fetchError) {
      console.error('Error fetching companions:', fetchError);
      throw fetchError;
    }
    
    // Supprimer les accompagnateurs existants
    if (existingCompanions && existingCompanions.length > 0) {
      const { error: deleteError } = await supabase
        .from('companions')
        .delete()
        .eq('user_id', userId);
      
      if (deleteError) {
        console.error('Error deleting companions:', deleteError);
        throw deleteError;
      }
    }
    
    // Insérer les nouveaux accompagnateurs
    const companionsToInsert = companions.map(companion => ({
      user_id: userId,
      first_name: companion.first_name || companion.firstName || '',
      last_name: companion.last_name || companion.lastName || '',
      relation: companion.relation,
      birth_date: companion.birthDate ? 
        (companion.birthDate instanceof Date ? 
          companion.birthDate.toISOString().split('T')[0] : 
          typeof companion.birthDate === 'string' ? 
            companion.birthDate : 
            null) : 
        null
    }));
    
    if (companionsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('companions')
        .insert(companionsToInsert);
      
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
 * Récupère les données des accompagnateurs depuis Supabase
 */
export const getCompanions = async (userId: string): Promise<CompanionData[]> => {
  try {
    const { data } = await supabase
      .from('companions')
      .select('*')
      .eq('user_id', userId);
    
    if (data) {
      return data.map(companion => ({
        id: companion.id,
        user_id: companion.user_id,
        first_name: companion.first_name,
        last_name: companion.last_name,
        relation: companion.relation,
        birthDate: companion.birth_date,
        created_at: companion.created_at,
        updated_at: companion.updated_at
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching companions from Supabase:', error);
    return [];
  }
};

/**
 * Supprime un accompagnateur spécifique
 */
export const deleteCompanion = async (companionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('companions')
      .delete()
      .eq('id', companionId);
    
    if (error) {
      console.error('Error deleting companion:', error);
      throw error;
    }
    
    console.log('Companion deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting companion:', error);
    return false;
  }
};
