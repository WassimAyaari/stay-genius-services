
import { supabase } from '@/integrations/supabase/client';

export type ServiceType = 'room_service' | 'housekeeping' | 'maintenance' | 'laundry' | 'concierge' | 'wifi' | 'bill' | 'preferences' | 'custom';

export const requestService = async (
  roomId: string, 
  type: ServiceType, 
  description?: string, 
  requestItemId?: string,
  categoryId?: string,
  guestName?: string,
  roomNumber?: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get user ID from localStorage if not authenticated
  const guestId = user?.id || localStorage.getItem('user_id');
  
  if (!guestId) throw new Error('User identification not available');
  
  // If roomNumber is not provided but available in localStorage, use it
  let finalRoomNumber = roomNumber;
  if (!finalRoomNumber) {
    try {
      const userDataStr = localStorage.getItem('user_data');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        finalRoomNumber = userData.room_number;
      }
    } catch (error) {
      console.error("Error getting room number from localStorage:", error);
    }
  }
  
  // If guestName is not provided but available in localStorage, use it
  let finalGuestName = guestName;
  if (!finalGuestName) {
    try {
      const userDataStr = localStorage.getItem('user_data');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        finalGuestName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
      }
    } catch (error) {
      console.error("Error getting guest name from localStorage:", error);
    }
  }
  
  const { data, error } = await supabase
    .from('service_requests')
    .insert({
      room_id: roomId,
      guest_id: guestId,
      type,
      description,
      category_id: categoryId,
      request_item_id: requestItemId,
      status: 'pending',
      guest_name: finalGuestName,
      room_number: finalRoomNumber
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

export const updateRequestStatus = async (requestId: string, status: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
  const { data, error } = await supabase
    .from('service_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', requestId)
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};
