
import { supabase } from '@/integrations/supabase/client';
import { UserInfo } from '../hooks/useUserInfo';
import { RequestCategory } from '@/features/rooms/types';
import { toast } from '@/hooks/use-toast';

/**
 * Creates a user profile in the database if it doesn't exist
 */
const createUserProfile = async (userId: string, userInfo: UserInfo) => {
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
    const profileCreated = await createUserProfile(userId, userInfo);
    console.log('Profile creation result:', profileCreated);
    
    if (!profileCreated) {
      console.warn("Could not create or verify user profile");
      toast({
        title: "Request Sent",
        description: "Your message was sent, but we couldn't register your request. Please contact reception.",
      });
      return true; // Return true because the message was sent
    }
    
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
    
    // Extract first and last name from full name for storing in the request
    const nameParts = userInfo.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const fullName = `${firstName} ${lastName}`.trim();
    
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
        guest_name: fullName || 'Guest' // Add full name for display
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

// Add a function to transform a service request into a chat message format
export const serviceRequestToMessage = (request: any): any => {
  return {
    id: request.id,
    text: request.description || 'No description provided',
    time: new Date(request.created_at).toLocaleString(),
    sender: 'user',
    status: 'sent',
    type: 'request',
    requestType: request.type,
    requestStatus: request.status
  };
};

// Function to handle push notifications for request updates
export const notifyRequestStatusChange = (request: any) => {
  const statusMessages = {
    pending: 'Your request is pending review',
    in_progress: 'Your request is now being processed',
    completed: 'Your request has been completed',
    cancelled: 'Your request has been cancelled'
  };
  
  if (statusMessages[request.status]) {
    // Use the browser notification API if permissions granted
    if (Notification.permission === 'granted') {
      new Notification('Request Update', {
        body: statusMessages[request.status],
        icon: '/favicon.ico'
      });
    }
    
    // Also show a toast notification
    import('sonner').then(({ toast }) => {
      toast.info('Request Status Update', {
        description: statusMessages[request.status]
      });
    });
  }
};
