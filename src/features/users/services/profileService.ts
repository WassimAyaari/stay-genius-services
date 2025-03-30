
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '../types/userTypes';

/**
 * Synchronise les données de profil avec Supabase
 */
export const syncProfileData = async (userId: string, profileData: Partial<ProfileData>): Promise<boolean> => {
  try {
    // Vérifier si le profil existe déjà
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    console.log('Existing profile:', existingProfile);
    console.log('Profile data to save:', profileData);
    
    if (existingProfile) {
      // Mettre à jour le profil existant
      const { error: updateError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId);
      
      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }
    } else {
      // Créer un nouveau profil
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: userId, ...profileData }]);
      
      if (insertError) {
        console.error('Error inserting profile:', insertError);
        throw insertError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error synchronizing profile data with Supabase:', error);
    return false;
  }
};

/**
 * Récupère les données de profil depuis Supabase
 */
export const getProfileData = async (userId: string): Promise<ProfileData | null> => {
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (profileError) throw profileError;
    if (!profileData) return null;
    
    return profileData;
  } catch (error) {
    console.error('Error fetching profile data from Supabase:', error);
    return null;
  }
};
