
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/features/users/types/userTypes';
import { useToast } from '@/hooks/use-toast';

/**
 * Inscription d'un utilisateur avec email et mot de passe et synchronisation des données
 */
export const registerUser = async (
  email: string,
  password: string,
  userData: Omit<UserData, 'email'>
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Registering user with email:', email);
    
    // Créer un utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name,
        }
      }
    });

    if (authError) {
      console.error('Erreur lors de l\'inscription:', authError);
      return { 
        success: false, 
        error: authError.message || 'Erreur lors de l\'inscription' 
      };
    }

    // Stocker aussi les données dans le localStorage pour la compatibilité avec le code existant
    const fullUserData = {
      ...userData,
      email
    };
    
    localStorage.setItem('user_data', JSON.stringify(fullUserData));
    
    if (authData.user) {
      localStorage.setItem('user_id', authData.user.id);
    }

    console.log('User registered successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error during registration:', error);
    return { 
      success: false, 
      error: error.message || 'Une erreur est survenue lors de l\'inscription' 
    };
  }
};

/**
 * Connexion d'un utilisateur avec email et mot de passe
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; userData?: UserData }> => {
  try {
    console.log('Logging in user with email:', email);
    
    // Connexion via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Erreur lors de la connexion:', authError);
      return { 
        success: false, 
        error: authError.message || 'Identifiants incorrects' 
      };
    }

    if (!authData.user) {
      return { 
        success: false, 
        error: 'Aucun utilisateur trouvé' 
      };
    }

    // Récupérer les données de l'utilisateur depuis Supabase
    const { data: guestData, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (guestError && guestError.code !== 'PGRST116') {
      console.error('Erreur lors de la récupération des données invité:', guestError);
    }

    // Si les données existent dans Supabase, les utiliser, sinon créer un objet vide
    const userData: UserData = guestData || {
      email: email,
      first_name: authData.user.user_metadata?.first_name || '',
      last_name: authData.user.user_metadata?.last_name || '',
      room_number: ''
    };

    // Stocker dans le localStorage pour la compatibilité
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('user_id', authData.user.id);

    console.log('User logged in successfully');
    return { 
      success: true,
      userData
    };
  } catch (error: any) {
    console.error('Error during login:', error);
    return { 
      success: false, 
      error: error.message || 'Une erreur est survenue lors de la connexion' 
    };
  }
};

/**
 * Déconnexion de l'utilisateur
 */
export const logoutUser = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Déconnexion de Supabase Auth
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Erreur lors de la déconnexion:', error);
      return { 
        success: false, 
        error: error.message || 'Erreur lors de la déconnexion' 
      };
    }
    
    // Supprimer les données du localStorage
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_id');
    
    console.log('User logged out successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error during logout:', error);
    return { 
      success: false, 
      error: error.message || 'Une erreur est survenue lors de la déconnexion' 
    };
  }
};

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
  const session = await getCurrentSession();
  
  // Vérifier si l'utilisateur a une session valide
  if (session && session.user) {
    return true;
  }
  
  // Fallback: vérifier si les données utilisateur sont dans le localStorage
  const userDataString = localStorage.getItem('user_data');
  return !!userDataString;
};
