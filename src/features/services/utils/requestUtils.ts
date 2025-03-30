
import { supabase } from '@/integrations/supabase/client';
import { UserInfo } from '../hooks/useUserInfo';
import { RequestCategory } from '@/features/rooms/types';
import { toast } from '@/hooks/use-toast';

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
    console.log("Submitting request:", {
      description,
      type,
      userInfo
    });
    
    // Insert the request as a chat message
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

    if (chatError) throw chatError;
    
    // Try to fetch the room
    try {
      const { data: roomData } = await supabase
        .from('rooms')
        .select('id')
        .eq('room_number', userInfo.roomNumber)
        .maybeSingle();
      
      let roomId = '';
      if (roomData) {
        roomId = roomData.id;
        console.log("Room found for insertion:", roomId);
      } else {
        console.warn("Room not found for number:", userInfo.roomNumber);
      }
      
      // Create a service request - without the guest_name and room_number fields
      // that aren't in the database schema
      const requestData = {
        room_id: roomId || null,
        guest_id: userId,
        type: type,
        description: description,
        category_id: selectedCategory?.id,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log("Creating service_request:", requestData);
      
      const { error: serviceError } = await supabase
        .from('service_requests')
        .insert(requestData);
        
      if (serviceError) {
        console.error("Error creating service request directly:", serviceError);
        throw serviceError;
      }
        
      console.log("Service request created successfully");
      
      return true;
    } catch (err) {
      console.error("Error in request submission process:", err);
      throw err;
    }
  } catch (error) {
    console.error("Error submitting request via chat:", error);
    return false;
  }
};
