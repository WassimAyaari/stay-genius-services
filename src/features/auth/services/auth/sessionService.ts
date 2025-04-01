
import { supabase } from '@/integrations/supabase/client';

/**
 * Récupérer la session utilisateur actuelle
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Erreur lors de la récupération de la session:', error);
      return null;
    }
    
    return data.session;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
};

/**
 * Vérifier si l'utilisateur est authentifié
 */
export const isAuthenticated = async (): Promise<boolean> => {
  console.log('Vérification de l\'authentification...');
  
  try {
    // 1. Vérifier si l'utilisateur a une session valide dans Supabase
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Erreur lors de la vérification de la session:', error);
      return false;
    }
    
    if (session) {
      console.log('Session Supabase valide trouvée');
      return true;
    }
    
    // 2. Fallback: vérifier si les données utilisateur sont dans le localStorage
    const userDataString = localStorage.getItem('user_data');
    const userIdString = localStorage.getItem('user_id');
    
    const isLocalStorageValid = !!userDataString && !!userIdString;
    
    console.log('Authentification via localStorage:', isLocalStorageValid);
    return isLocalStorageValid;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error);
    return false;
  }
};
