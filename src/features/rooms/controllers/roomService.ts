
import { supabase } from '@/integrations/supabase/client';
import { ServiceType } from '../types';

// Function to create a new service request
export const createServiceRequest = async (requestData: {
  guest_id: string;
  room_id: string;
  type: string;
  description: string;
  status?: string;
  request_item_id?: string;
  category_id?: string;
}) => {
  const { data, error } = await supabase
    .from('service_requests')
    .insert({
      ...requestData,
      status: requestData.status || 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating service request:', error);
    throw error;
  }

  return data;
};

// Adding the requestService function for compatibility
export const requestService = async (
  roomId: string,
  type: ServiceType,
  description: string,
  request_item_id?: string,
  category_id?: string
) => {
  // Get guest_id from local storage or use a default
  const userDataStr = localStorage.getItem('user_data');
  let guest_id = '00000000-0000-0000-0000-000000000000'; // Default guest ID

  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);
      if (userData.id) {
        guest_id = userData.id;
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }

  try {
    // Now that RLS is disabled, we can directly insert into the database
    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        guest_id,
        room_id: roomId,
        type,
        description,
        request_item_id,
        category_id,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error('Error saving request to database:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error submitting service request:', error);
    throw error;
  }
};

// Function to update the status of a service request
export const updateRequestStatus = async (
  requestId: string,
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
) => {
  const { data, error } = await supabase
    .from('service_requests')
    .update({ status })
    .eq('id', requestId)
    .select()
    .single();

  if (error) {
    console.error('Error updating request status:', error);
    throw error;
  }

  return data;
};

// Function to get service requests for a room
export const getServiceRequestsForRoom = async (roomId: string) => {
  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error getting service requests:', error);
    throw error;
  }

  return data;
};
