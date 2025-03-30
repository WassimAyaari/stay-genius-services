
import { supabase } from '@/integrations/supabase/client';

export type ServiceType = 'housekeeping' | 'laundry' | 'wifi' | 'bill' | 'preferences' | 'concierge' | 'custom';

export const updateRequestStatus = async (
  requestId: string, 
  newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled'
) => {
  try {
    console.log(`Updating request ${requestId} to status: ${newStatus}`);
    
    const { data, error } = await supabase
      .from('service_requests')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', requestId)
      .select();

    if (error) {
      console.error("Error updating request status:", error);
      throw error;
    }

    console.log("Status updated successfully:", data);
    
    // When we update the status, we want to add a system message to the chat
    // so the user can see the status change
    if (data && data.length > 0) {
      const request = data[0];
      
      // Only add a chat message if the request has a guest_id
      if (request.guest_id) {
        // Fix: Check if room_number exists before accessing it
        const roomNumber = request.room_number || '';
        
        const statusMessage = `Your ${request.type} request has been updated to: ${newStatus}`;
        
        await supabase.from('chat_messages').insert({
          user_id: request.guest_id,
          recipient_id: request.guest_id,
          user_name: 'System',
          room_number: roomNumber,
          text: statusMessage,
          sender: 'staff',
          status: 'sent',
          created_at: new Date().toISOString()
        });
      }
    }
    
    return data;
  } catch (error) {
    console.error("Error in updateRequestStatus:", error);
    throw error;
  }
};

export const createServiceRequest = async (
  guestId: string,
  guestName: string,
  roomNumber: string,
  requestType: string,
  description: string
) => {
  try {
    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        guest_id: guestId,
        guest_name: guestName,
        room_number: roomNumber,
        type: requestType,
        description: description,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select();
      
    if (error) {
      console.error("Error creating service request:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in createServiceRequest:", error);
    throw error;
  }
};

// Add the missing requestService function
export const requestService = async (
  roomId: string,
  type: ServiceType, 
  description: string,
  requestItemId?: string,
  categoryId?: string,
  guestName?: string,
  roomNumber?: string
) => {
  try {
    console.log(`Creating service request for room ${roomId}: ${type}`);
    
    // Get the current user ID or use a guest ID
    const userId = localStorage.getItem('user_id') || 'guest';
    
    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        room_id: roomId,
        guest_id: userId,
        guest_name: guestName || 'Guest',
        room_number: roomNumber,
        type: type,
        description: description,
        request_item_id: requestItemId,
        category_id: categoryId,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error("Error creating service request:", error);
      throw error;
    }

    console.log("Service request created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in requestService:", error);
    throw error;
  }
};
