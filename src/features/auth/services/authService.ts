
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
): Promise<{ success: boolean; error?: string; userId?: string }> => {
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

    if (!authData.user) {
      return { 
        success: false, 
        error: 'Erreur de création de compte' 
      };
    }

    // Stocker aussi les données dans le localStorage pour la compatibilité avec le code existant
    const fullUserData = {
      ...userData,
      email,
      id: authData.user.id
    };
    
    localStorage.setItem('user_data', JSON.stringify(fullUserData));
    localStorage.setItem('user_id', authData.user.id);

    console.log('User registered successfully');
    return { 
      success: true,
      userId: authData.user.id
    };
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
    const userData: UserData = guestData ? {
      id: authData.user.id,
      email: email,
      first_name: guestData.first_name || authData.user.user_metadata?.first_name || '',
      last_name: guestData.last_name || authData.user.user_metadata?.last_name || '',
      room_number: guestData.room_number || '',
      // Keep dates as strings to avoid conversion issues
      birth_date: guestData.birth_date || undefined,
      check_in_date: guestData.check_in_date || undefined,
      check_out_date: guestData.check_out_date || undefined,
      nationality: guestData.nationality
    } : {
      id: authData.user.id,
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
    console.log('Starting logout process in authService');
    
    // Déconnexion de Supabase Auth
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Erreur lors de la déconnexion Supabase dans authService:', error);
      return { 
        success: false, 
        error: error.message || 'Erreur lors de la déconnexion' 
      };
    }
    
    // Nettoyer localStorage de manière synchrone pour être sûr
    try {
      console.log('Clearing local storage data in authService');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_id');
      sessionStorage.clear(); // Nettoyer aussi le sessionStorage par précaution
    } catch (e) {
      console.error('Erreur lors du nettoyage du localStorage dans authService:', e);
    }
    
    console.log('User logged out successfully in authService');
    return { success: true };
  } catch (error: any) {
    console.error('Error during logout in authService:', error);
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
