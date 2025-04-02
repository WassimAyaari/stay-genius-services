
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/features/users/types/userTypes';
import { syncGuestData } from '@/features/users/services/guestService';

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
    
    console.log('User authenticated successfully:', authData.user);

    // Récupérer les données de l'utilisateur depuis Supabase
    const { data: guestData, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (guestError && guestError.code !== 'PGRST116') {
      console.error('Erreur lors de la récupération des données invité:', guestError);
    }

    // Si les données existent dans Supabase, les utiliser, sinon créer un objet avec les données minimales
    const userData: UserData = guestData ? {
      id: authData.user.id,
      email: email,
      first_name: guestData.first_name || authData.user.user_metadata?.first_name || 'Utilisateur',
      last_name: guestData.last_name || authData.user.user_metadata?.last_name || '',
      room_number: guestData.room_number || '',
      // Keep dates as strings to avoid conversion issues
      birth_date: guestData.birth_date || undefined,
      check_in_date: guestData.check_in_date || undefined,
      check_out_date: guestData.check_out_date || undefined,
      nationality: guestData.nationality,
      profile_image: guestData.profile_image,
      guest_type: guestData.guest_type || 'Standard Guest'
    } : {
      id: authData.user.id,
      email: email,
      first_name: authData.user.user_metadata?.first_name || 'Utilisateur',
      last_name: authData.user.user_metadata?.last_name || '',
      room_number: '',
      guest_type: 'Standard Guest'
    };

    // Stocker dans le localStorage pour la compatibilité
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('user_id', authData.user.id);

    // Si nous n'avons pas trouvé des données guest dans Supabase ou si les données sont incomplètes,
    // synchroniser les données utilisateur avec Supabase
    if (!guestData || !guestData.room_number) {
      await syncGuestData(authData.user.id, userData);
    }

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
