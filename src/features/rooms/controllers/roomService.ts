
import { supabase } from '@/integrations/supabase/client';

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

  // Fix TypeScript error by ensuring return type
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
