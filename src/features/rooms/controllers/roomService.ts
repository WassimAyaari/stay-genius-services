
import { supabase } from '@/integrations/supabase/client';

export type ServiceType = 'housekeeping' | 'laundry' | 'wifi' | 'bill' | 'preferences' | 'concierge' | 'custom';

export const updateRequestStatus = async (
  requestId: string, 
  newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled'
) => {
  try {
    console.log(`Updating request ${requestId} to status: ${newStatus}`);
    
    // First, get the current request to have all the data we need
    const { data: requestData, error: requestError } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (requestError) {
      console.error("Error fetching request data:", requestError);
      throw requestError;
    }

    // Then update the status
    const { data: updateData, error: updateError } = await supabase
      .from('service_requests')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', requestId)
      .select('*');

    if (updateError) {
      console.error("Error updating request status:", updateError);
      throw updateError;
    }

    console.log("Status updated successfully:", updateData);
    
    // Use the initially fetched data to access all the needed properties
    if (requestData && requestData.guest_id) {
      // We'll use the room_id from the request data if available
      const roomNumber = requestData.room_id || ''; // Use room_id instead of room_number since it's definitely in the type
      
      const statusMessage = `Your ${requestData.type} request has been updated to: ${newStatus}`;
      
      await supabase.from('chat_messages').insert({
        user_id: requestData.guest_id,
        recipient_id: requestData.guest_id,
        user_name: 'System',
        room_number: roomNumber, // Passing roomNumber (derived from room_id) to the chat_messages table
        text: statusMessage,
        sender: 'staff',
        status: 'sent',
        created_at: new Date().toISOString()
      });
    }
    
    return updateData;
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

// Make sure this function is properly exported
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
