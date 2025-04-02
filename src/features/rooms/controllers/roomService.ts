
import { supabase } from '@/integrations/supabase/client';
import { ServiceType } from '../types';
import { toast } from '@/hooks/use-toast';
import { RoomType, ServiceRequestType } from '@/features/types/supabaseTypes';

// Function to create a new service request
export const createServiceRequest = async (requestData: {
  guest_id: string;
  room_id: string;
  type: string;
  description: string;
  status?: string;
  request_item_id?: string;
  category_id?: string;
  room_number?: string;
  guest_name?: string;
}) => {
  try {
    // Assurez-vous que les données room_number et guest_name sont présentes
    if (!requestData.room_number) {
      // Essayez de récupérer le numéro de chambre à partir du localStorage
      const userDataStr = localStorage.getItem('user_data');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          if (userData.room_number) {
            requestData.room_number = userData.room_number;
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }

    if (!requestData.guest_name) {
      // Essayez de récupérer le nom de l'invité à partir du localStorage
      const userDataStr = localStorage.getItem('user_data');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
          if (fullName) {
            requestData.guest_name = fullName || 'Guest';
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }

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
    // Get guest_id and user data from local storage
    const userDataStr = localStorage.getItem('user_data');
    let guest_id = '00000000-0000-0000-0000-000000000000'; // Default guest ID
    let guest_name = 'Guest';
    let room_number = '';

    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        if (userData.id) {
          guest_id = userData.id;
        }
        
        // Récupérer le nom complet
        guest_name = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Guest';
        
        // Privilégier le numéro de chambre de l'utilisateur authentifié
        if (userData.room_number) {
          room_number = userData.room_number;
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Si le numéro de chambre n'est pas disponible dans user_data, essayer d'utiliser le roomId
    if (!room_number && !roomId.includes('-')) {
      room_number = roomId;
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
    
    // Save the room number to localStorage for future reference if it's not a UUID
    if (room_number && !localStorage.getItem('user_room_number')) {
      localStorage.setItem('user_room_number', room_number);
    }
    
    // Insert the request with the correct room_id
    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        guest_id,
        room_id: actualRoomId,
        room_number: room_number || roomId.includes('-') ? undefined : roomId,
        guest_name,
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
