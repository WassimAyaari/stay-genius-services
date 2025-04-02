
import { supabase } from '@/integrations/supabase/client';
import { UserInfo } from '../hooks/useUserInfo';
import { RequestCategory } from '@/features/rooms/types';
import { toast } from '@/hooks/use-toast';
import { syncGuestData } from '@/features/users/services/guestService';

/**
 * Submits a service request via chat message
 */
export const submitRequestViaChatMessage = async (
  description: string, 
  type: string, 
  userInfo: UserInfo,
  selectedCategory?: RequestCategory | null
) => {
  console.log('Submitting request via chat message:', { description, type, userInfo, selectedCategory });
  
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
    // Step 1: Create a chat message
    console.log('Creating chat message');
    const { error: chatError } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        recipient_id: null,
        user_name: userInfo.name || 'Guest',
        room_number: userInfo.roomNumber,
        text: description,
        sender: 'user',
        status: 'sent',
        created_at: new Date().toISOString()
      });

    if (chatError) {
      console.error("Error creating chat message:", chatError);
      throw chatError;
    }
    
    // Step 2: Always try to create user profile if it doesn't exist
    console.log('Attempting to create/update user profile');
    
    // Create user data object to sync - using the proper format
    const userData = {
      id: userId,
      email: userInfo.email || '',
      first_name: userInfo.name.split(' ')[0] || '',
      last_name: userInfo.name.split(' ').slice(1).join(' ') || '',
      room_number: userInfo.roomNumber || '',
      phone: userInfo.phone || ''
    };
    
    // Sync to guests table using the syncGuestData function
    const profileSynced = await syncGuestData(userId, userData);
    console.log('Profile sync result:', profileSynced);
    
    // Step 3: Check if room exists and get room_id
    console.log('Checking if room exists:', userInfo.roomNumber);
    const { data: roomData } = await supabase
      .from('rooms')
      .select('id')
      .eq('room_number', userInfo.roomNumber)
      .maybeSingle();
    
    console.log('Room data:', roomData);
    
    // Define a valid room_id to use - either from database or use userId as a fallback
    const roomId = roomData?.id || userId;
    
    // Step 4: Create service request with minimal required data
    try {
      const requestData: any = {
        guest_id: userId,
        room_id: roomId, // Always provide a valid room_id
        type: type,
        description: description,
        status: 'pending',
        created_at: new Date().toISOString(),
        room_number: userInfo.roomNumber, // Include room_number for display purposes
        guest_name: userInfo.name || 'Guest' // Add guest name for display
      };

      // Add category if available
      if (selectedCategory?.id) {
        requestData.category_id = selectedCategory.id;
      }
      
      console.log('Creating service request with data:', requestData);
      
      // Insert service request
      const { error: serviceError } = await supabase
        .from('service_requests')
        .insert(requestData);
      
      if (serviceError) {
        console.error("Error submitting service request:", serviceError);
        
        toast({
          title: "Partial Success",
          description: "Your message was sent, but we couldn't register your full request. Our staff will still assist you.",
          variant: "destructive"
        });
        
        return true;
      }
    } catch (requestError) {
      console.error("Error creating service request:", requestError);
      toast({
        title: "Message Sent",
        description: "Your message was sent, but we encountered an issue with your request. Our staff will assist you.",
        variant: "destructive"
      });
      return true;
    }
    
    toast({
      title: "Request Submitted",
      description: "Your request has been sent successfully."
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
