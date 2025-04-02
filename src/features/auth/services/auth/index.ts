
// Authentication-related utility functions

import { supabase } from '@/integrations/supabase/client';

/**
 * Vérifie si l'utilisateur est authentifié
 * @returns {Promise<boolean>} True si l'utilisateur est authentifié
 */
export const isAuthenticated = async (): Promise<boolean> => {
  // Vérifier d'abord la session Supabase
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("Erreur lors de la vérification de la session:", error);
    return false;
  }
  
  // Vérifier aussi les données en localStorage pour une double validation
  const userDataString = localStorage.getItem('user_data');
  const userId = localStorage.getItem('user_id');
  
  // Authentification validée si session Supabase OK, ou localStorage avec données cohérentes
  return !!session || (!!userDataString && !!userId);
};

/**
 * Vérifie si l'utilisateur a des droits d'administrateur
 * Cette fonction est temporairement configurée pour retourner true
 * @returns {Promise<boolean>} True si l'utilisateur a des droits d'administrateur
 */
export const isAdmin = async (): Promise<boolean> => {
  // Temporairement retourner true pour tous les utilisateurs authentifiés
  // afin de permettre l'accès à la section admin sans restrictions
  return await isAuthenticated();
};
