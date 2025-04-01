
import { supabase } from '@/integrations/supabase/client';
import { UserInfo } from '../hooks/useUserInfo';
import { toast } from '@/hooks/use-toast';

/**
 * Creates a user profile in the database if it doesn't exist
 */
export const createUserProfile = async (userId: string, userInfo: UserInfo) => {
  console.log('Creating user profile:', userId, userInfo);
  try {
    // Extract first and last name from full name
    const nameParts = userInfo.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Check if guest already exists in the guests table
    const { data: existingGuest } = await supabase
      .from('guests')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (existingGuest) {
      console.log('Guest profile already exists, skipping creation');
      return true;
    }
    
    // Insert directly into guests table
    const { data, error } = await supabase
      .from('guests')
      .insert([{
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        email: '',
        room_number: userInfo.roomNumber,
        guest_type: 'Premium Guest',
        phone: userInfo.phone || ''
      }]);
    
    if (error) {
      console.error("Error inserting guest data:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in createUserProfile:", error);
    return false;
  }
};
