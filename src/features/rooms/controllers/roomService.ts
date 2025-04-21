
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
    // S'assurer que le room_number est toujours présent
    if (!requestData.room_number) {
      // Privilégier le room_number stocké dans localStorage
      const storedRoomNumber = localStorage.getItem('user_room_number');
      if (storedRoomNumber) {
        requestData.room_number = storedRoomNumber;
        console.log('Using room number from localStorage:', storedRoomNumber);
      } else {
        // Essayer de récupérer le numéro de chambre à partir des données utilisateur
        const userDataStr = localStorage.getItem('user_data');
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            if (userData.room_number) {
              requestData.room_number = userData.room_number;
              console.log('Using room number from user data:', userData.room_number);
            }
          } catch (error) {
            console.error("Error parsing user data:", error);
          }
        }
      }
    }

    // S'assurer que le guest_name est toujours présent
    if (!requestData.guest_name || requestData.guest_name === 'Guest') {
      const userDataStr = localStorage.getItem('user_data');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
          if (fullName) {
            requestData.guest_name = fullName || 'Guest';
            console.log('Using guest name from user data:', fullName);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
      
      // If still no guest name, try to get it from the database based on room number
      if ((!requestData.guest_name || requestData.guest_name === 'Guest') && requestData.room_number) {
        try {
          const { data: guestData, error: guestError } = await supabase
            .from('guests')
            .select('first_name, last_name')
            .eq('room_number', requestData.room_number)
            .limit(1)
            .maybeSingle();
          
          if (!guestError && guestData) {
            requestData.guest_name = `${guestData.first_name || ''} ${guestData.last_name || ''}`.trim() || 'Guest';
            console.log('Using guest name from database:', requestData.guest_name);
          }
        } catch (error) {
          console.error("Error fetching guest data:", error);
        }
      }
    }

    console.log('Creating service request with data:', {
      guest_id: requestData.guest_id,
      room_number: requestData.room_number,
      guest_name: requestData.guest_name,
      type: requestData.type
    });

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

// Mettre à jour la fonction requestService également
export const requestService = async (
  roomId: string,
  type: ServiceType,
  description: string,
  request_item_id?: string,
  category_id?: string
) => {
  try {
    // Récupérer l'ID utilisateur et les données utilisateur du localStorage
    const userId = localStorage.getItem('user_id') || '00000000-0000-0000-0000-000000000000';
    
    // Privilégier le room_number stocké directement dans localStorage
    let room_number = localStorage.getItem('user_room_number') || '';
    let guest_name = 'Guest';
    
    // Si le room_number n'est pas disponible, essayer de le récupérer des données utilisateur
    if (!room_number) {
      const userDataStr = localStorage.getItem('user_data');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          
          // Récupérer le nom complet
          guest_name = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Guest';
          
          // Récupérer le numéro de chambre
          if (userData.room_number) {
            room_number = userData.room_number;
            // Sauvegarder dans localStorage pour un accès plus facile à l'avenir
            localStorage.setItem('user_room_number', room_number);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }

    // Si le numéro de chambre n'est toujours pas disponible, essayer d'utiliser le roomId
    if (!room_number && !roomId.includes('-')) {
      room_number = roomId;
      // Sauvegarder dans localStorage
      localStorage.setItem('user_room_number', room_number);
    }
    
    console.log('Submitting service request with room_number:', room_number);
    
    // Vérifier si le roomId est au format UUID ou au format numéro de chambre
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
    
    console.log('Final request parameters:', {
      guest_id: userId,
      room_id: actualRoomId,
      room_number,
      guest_name,
      type,
      description
    });
    
    // Insérer la demande avec les bonnes données
    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        guest_id: userId,
        room_id: actualRoomId,
        room_number: room_number,
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
