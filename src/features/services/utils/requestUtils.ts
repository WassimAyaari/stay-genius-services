
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
    
    // Fetch room ID first based on room number
    let roomId = null;
    const { data: roomData } = await supabase
      .from('rooms')
      .select('id')
      .eq('room_number', userInfo.roomNumber)
      .maybeSingle();
    
    if (roomData) {
      roomId = roomData.id;
    }
    
    // Insert the service request in the database with the correct room_id format
    const { error: serviceError } = await supabase
      .from('service_requests')
      .insert([{
        guest_id: userId,
        room_id: roomId, // Use the fetched room ID or null if not found
        type: type,
        description: description,
        category_id: selectedCategory?.id,
        status: 'pending',
        created_at: new Date().toISOString()
      }]);
    
    if (serviceError) {
      console.error("Error submitting service request:", serviceError);
      // We still return true if the chat message was created successfully
      console.log("Chat message created successfully, but service request failed.");
      return true;
    }
    
    // Return success
    return true;
  } catch (error) {
    console.error("Error submitting request via chat:", error);
    return false;
  }
};
