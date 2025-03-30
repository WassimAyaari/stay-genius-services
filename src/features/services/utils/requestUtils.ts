
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
      userInfo,
      categoryId: selectedCategory?.id
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
    
    // First check if room number exists and get the room_id
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select('id')
      .eq('room_number', userInfo.roomNumber)
      .maybeSingle();
    
    if (roomError) {
      console.error("Error fetching room:", roomError);
      throw roomError;
    }
    
    if (!roomData) {
      console.error("Room not found:", userInfo.roomNumber);
      
      // Si la chambre n'existe pas, tentons de la créer
      const { data: newRoom, error: createRoomError } = await supabase
        .from('rooms')
        .insert([{
          room_number: userInfo.roomNumber,
          type: 'standard',
          floor: parseInt(userInfo.roomNumber.substring(0, 1)) || 1,
          status: 'occupied',
          price: 100,
          capacity: 2,
          amenities: ['wifi', 'tv', 'minibar'],
          images: []
        }])
        .select()
        .maybeSingle();
      
      if (createRoomError) {
        console.error("Error creating room:", createRoomError);
        toast({
          title: "Error creating room",
          description: `Failed to create room ${userInfo.roomNumber} in our system.`,
          variant: "destructive"
        });
        return false;
      }
      
      if (!newRoom) {
        toast({
          title: "Room creation failed",
          description: `Could not create room ${userInfo.roomNumber}.`,
          variant: "destructive"
        });
        return false;
      }
      
      // Insert the service request with the newly created room_id
      const { error: serviceError } = await supabase
        .from('service_requests')
        .insert([{
          guest_id: userId,
          room_id: newRoom.id,
          type: type,
          description: description,
          category_id: selectedCategory?.id || null,
          status: 'pending',
          created_at: new Date().toISOString()
        }]);
      
      if (serviceError) {
        console.error("Error submitting service request:", serviceError);
        throw serviceError;
      }
    } else {
      // Insert the service request with the existing room_id
      const { error: serviceError } = await supabase
        .from('service_requests')
        .insert([{
          guest_id: userId,
          room_id: roomData.id,
          type: type,
          description: description,
          category_id: selectedCategory?.id || null,
          status: 'pending',
          created_at: new Date().toISOString()
        }]);
      
      if (serviceError) {
        console.error("Error submitting service request:", serviceError);
        throw serviceError;
      }
    }
    
    console.log("Service request submitted successfully");
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
