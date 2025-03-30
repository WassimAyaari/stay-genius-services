
import { supabase } from '@/integrations/supabase/client';
import { UserInfo } from '../hooks/useUserInfo';
import { RequestCategory } from '@/features/rooms/types';
import { toast } from '@/hooks/use-toast';

/**
 * Creates a user profile in the database if it doesn't exist
 */
const createUserProfile = async (userId: string, userInfo: UserInfo) => {
  try {
    // Extract first and last name from full name
    const nameParts = userInfo.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Insert the profile
    const { error } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        first_name: firstName,
        last_name: lastName
      }]);
    
    if (error) {
      console.error("Error inserting profile:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in createUserProfile:", error);
    return false;
  }
};

/**
 * Submits a service request via chat message
 */
export const submitRequestViaChatMessage = async (
  description: string, 
  type: string, 
  userInfo: UserInfo,
  selectedCategory?: RequestCategory | null
) => {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    toast({
      title: "User ID missing",
      description: "Unable to submit request without user identification.",
      variant: "destructive"
    });
    return false;
  }

  // Make sure we have room number - display error if missing
  if (!userInfo.roomNumber) {
    toast({
      title: "Room information missing",
      description: "Unable to submit request without room number.",
      variant: "destructive"
    });
    return false;
  }

  try {
    // Step 1: Create a chat message (this doesn't require a profile)
    const { error: chatError } = await supabase
      .from('chat_messages')
      .insert([{
        user_id: userId,
        recipient_id: null,
        user_name: userInfo.name || 'Guest',
        room_number: userInfo.roomNumber,
        text: description,
        sender: 'user',
        status: 'sent',
        created_at: new Date().toISOString()
      }]);

    if (chatError) {
      console.error("Error creating chat message:", chatError);
      throw chatError;
    }
    
    // Step 2: Try to create user profile if it doesn't exist
    try {
      await createUserProfile(userId, userInfo);
    } catch (profileError) {
      console.warn("Failed to create profile, but continuing with request", profileError);
      // Continue despite profile creation failure
    }
    
    // Step 3: Check if room exists and get room_id
    const { data: roomData } = await supabase
      .from('rooms')
      .select('id')
      .eq('room_number', userInfo.roomNumber)
      .maybeSingle();
    
    // Step 4: Create service request with minimal required data
    try {
      const requestData = {
        guest_id: userId,
        type: type,
        description: description,
        category_id: selectedCategory?.id || null,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      // Add room_id only if the room exists
      if (roomData?.id) {
        Object.assign(requestData, { room_id: roomData.id });
      }
      
      // Insert service request (will only work if profile exists)
      const { error: serviceError } = await supabase
        .from('service_requests')
        .insert([requestData]);
      
      if (serviceError) {
        console.error("Error submitting service request:", serviceError);
        
        // If we failed because the profile doesn't exist, show a special error
        if (serviceError.code === '23503' && serviceError.details?.includes('guest_id')) {
          toast({
            title: "Profile Error",
            description: "Your user profile is not set up correctly. Please contact reception.",
            variant: "destructive"
          });
        } else {
          // For other errors, show generic message
          toast({
            title: "Error",
            description: "Failed to submit service request. The chat message was sent.",
            variant: "destructive"
          });
        }
        
        // Return partial success since the chat message was sent
        return true;
      }
    } catch (requestError) {
      console.error("Error creating service request:", requestError);
      // Continue despite service request failure since chat message was sent
    }
    
    toast({
      title: "Request Submitted",
      description: "Your request has been sent successfully.",
    });
    
    return true;
  } catch (error) {
    console.error("Error submitting request via chat:", error);
    toast({
      title: "Error",
      description: "Failed to submit request. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};
