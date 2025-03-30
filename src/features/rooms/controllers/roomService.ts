
import { supabase } from '@/integrations/supabase/client';
import { ServiceType } from '../types';
import { toast } from '@/hooks/use-toast';

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
  try {
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
  } catch (error) {
    console.error('Error in createServiceRequest:', error);
    throw error;
  }
};

// Adding the requestService function for compatibility
export const requestService = async (
  roomId: string,
  type: ServiceType,
  description: string,
  request_item_id?: string,
  category_id?: string
) => {
  try {
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

    // First, check if the roomId is in room number format (e.g., "406")
    // If so, fetch the actual UUID from the rooms table
    let actualRoomId = roomId;
    
    if (!roomId.includes('-')) {
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('id')
        .eq('room_number', roomId)
        .maybeSingle();
      
      if (roomError) {
        console.error('Error fetching room data:', roomError);
        throw roomError;
      }
      
      if (roomData) {
        actualRoomId = roomData.id;
      } else {
        console.error('Room not found:', roomId);
        toast({
          title: "Room Not Found",
          description: `We couldn't find room ${roomId} in our system.`,
          variant: "destructive"
        });
        throw new Error(`Room ${roomId} not found`);
      }
    }
    
    console.log('Submitting service request with room_id:', actualRoomId);
    
    // Insert the request with the correct room_id
    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        guest_id,
        room_id: actualRoomId,
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
  try {
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
  } catch (error) {
    console.error('Error in updateRequestStatus:', error);
    throw error;
  }
};

// Function to get service requests for a room
export const getServiceRequestsForRoom = async (roomId: string) => {
  try {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        request_items(*)
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting service requests:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getServiceRequestsForRoom:', error);
    throw error;
  }
};
