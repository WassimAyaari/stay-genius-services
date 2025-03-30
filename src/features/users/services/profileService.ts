
// Ce fichier n'est plus nécessaire car nous utilisons uniquement la table guests.
// Il est maintenu pour des raisons de compatibilité, mais toutes les fonctions
// renverront des résultats vides ou des succès factices.

import { ProfileData } from '../types/userTypes';

/**
 * Cette fonction est maintenue pour la compatibilité mais ne fait plus rien
 */
export const syncProfileData = async (userId: string, profileData: Partial<ProfileData>): Promise<boolean> => {
  console.log('syncProfileData est déprécié, utiliser syncGuestData à la place');
  return true;
};

/**
 * Cette fonction est maintenue pour la compatibilité mais renverra null
 */
export const getProfileData = async (userId: string): Promise<ProfileData | null> => {
  console.log('getProfileData est déprécié, utiliser getGuestData à la place');
  return null;
};
