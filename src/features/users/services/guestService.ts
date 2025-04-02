
import { supabase } from '@/integrations/supabase/client';
import { GuestData, UserData, CompanionData } from '../types/userTypes';
import { syncCompanions } from './companionService';
import { cleanupDuplicateGuestRecords } from './cleanupService';

// Re-export the cleanup function
export { cleanupDuplicateGuestRecords } from './cleanupService';

/**
 * Synchronise les données d'invité avec Supabase
 */
export const syncGuestData = async (userId: string, userData: UserData): Promise<boolean> => {
  try {
    console.log('Syncing guest data for user:', userId);
    
    // Clean up any duplicate records first
    await cleanupDuplicateGuestRecords(userId);
    
    // After cleanup, find the FIRST record (if any exist)
    const { data: existingGuests, error: countError } = await supabase
      .from('guests')
      .select('*')
      .eq('user_id', userId)
      .limit(1);
    
    if (countError) {
      console.error('Error checking for existing guest:', countError);
      throw countError;
    }
    
    const existingGuest = existingGuests && existingGuests.length > 0 ? existingGuests[0] : null;
    
    // Préparer les données à insérer ou mettre à jour 
    const guestData: GuestData = {
      user_id: userId,
      first_name: userData.first_name || 'Sofia', // Default to Sofia instead of empty
      last_name: userData.last_name || 'Ayari',   // Default to Ayari instead of empty
      email: userData.email,
      room_number: userData.room_number || '401', // Default room number
      phone: userData.phone,
      // Safely convert date objects to ISO strings or pass strings as is
      check_in_date: userData.check_in_date ? 
        (userData.check_in_date instanceof Date ? 
          userData.check_in_date.toISOString().split('T')[0] : 
          typeof userData.check_in_date === 'string' ? 
            userData.check_in_date : 
            undefined) : 
        undefined,
      check_out_date: userData.check_out_date ? 
        (userData.check_out_date instanceof Date ? 
          userData.check_out_date.toISOString().split('T')[0] : 
          typeof userData.check_out_date === 'string' ? 
            userData.check_out_date : 
            undefined) : 
        undefined,
      birth_date: userData.birth_date ? 
        (userData.birth_date instanceof Date ? 
          userData.birth_date.toISOString().split('T')[0] : 
          typeof userData.birth_date === 'string' ? 
            userData.birth_date : 
            undefined) : 
        undefined,
      nationality: userData.nationality,
      profile_image: userData.profile_image,
      guest_type: userData.guest_type || 'Premium Guest', // All guests will be Premium
    };
    
    console.log('Guest data to save:', guestData);
    
    if (existingGuest) {
      // Update existing guest - use the ID of the first record we found
      const { error: updateError } = await supabase
        .from('guests')
        .update(guestData)
        .eq('user_id', userId)
        .eq('id', existingGuest.id);
      
      if (updateError) {
        console.error('Error updating guest:', updateError);
        throw updateError;
      }
    } else {
      // Create a new guest
      const { error: insertError } = await supabase
        .from('guests')
        .insert([guestData]);
      
      if (insertError) {
        console.error('Error inserting guest:', insertError);
        throw insertError;
      }
    }
    
    // If the user has companions, sync them as well
    if (userData.companions && userData.companions.length > 0) {
      await syncCompanions(userId, userData.companions);
    }
    
    console.log('Guest data synchronized with Supabase');
    return true;
  } catch (error) {
    console.error('Error synchronizing guest data with Supabase:', error);
    return false;
  }
};

/**
 * Récupère les données utilisateur depuis Supabase
 */
export const getGuestData = async (userId: string): Promise<UserData | null> => {
  try {
    console.log('Fetching guest data from Supabase for user:', userId);
    
    // Clean up any duplicate records first
    await cleanupDuplicateGuestRecords(userId);
    
    // After cleanup, select ONLY the first record 
    const { data: guestRecords, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('user_id', userId)
      .limit(1);
    
    if (guestError) {
      console.error('Error fetching guest data:', guestError);
      throw guestError;
    }
    
    // Get the first record if available
    const guestData = guestRecords && guestRecords.length > 0 ? guestRecords[0] : null;
    
    if (guestData) {
      console.log('Guest data found in Supabase:', guestData);
      
      // Build UserData object from guest data
      const userData: UserData = {
        id: userId,
        email: guestData.email || '',
        first_name: guestData.first_name || 'Sofia', // Default to Sofia
        last_name: guestData.last_name || 'Ayari',   // Default to Ayari
        room_number: guestData.room_number || '401', // Default room
        phone: guestData.phone,
        // Keep the dates as strings to avoid conversion issues
        birth_date: guestData.birth_date || undefined,
        nationality: guestData.nationality,
        check_in_date: guestData.check_in_date || undefined,
        check_out_date: guestData.check_out_date || undefined,
        profile_image: guestData.profile_image,
        guest_type: guestData.guest_type || 'Premium Guest',
      };
      
      // Get and add companions
      try {
        const companions = await getCompanionsForUser(userId);
        if (companions && companions.length > 0) {
          userData.companions = companions;
        }
      } catch (compError) {
        console.error('Error fetching companions:', compError);
      }
      
      return userData;
    }
    
    // If no guest data found, return default Sofia profile
    console.log('No guest data found in Supabase for user:', userId);
    return {
      id: userId,
      email: '',
      first_name: 'Sofia',
      last_name: 'Ayari',
      room_number: '401',
      guest_type: 'Premium Guest'
    };
  } catch (error) {
    console.error('Error fetching guest data from Supabase:', error);
    // Return default Sofia profile on error
    return {
      id: userId,
      email: '',
      first_name: 'Sofia',
      last_name: 'Ayari',
      room_number: '401',
      guest_type: 'Premium Guest'
    };
  }
};

// Helper function to get companions for a user
const getCompanionsForUser = async (userId: string): Promise<CompanionData[]> => {
  try {
    const { data, error } = await supabase
      .from('companions')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map(comp => ({
        id: comp.id,
        user_id: comp.user_id,
        first_name: comp.first_name,
        last_name: comp.last_name,
        relation: comp.relation,
        birthDate: comp.birth_date
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching companions for user:', error);
    return [];
  }
};
