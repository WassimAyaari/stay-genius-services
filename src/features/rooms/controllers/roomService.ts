
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
      guest_name: guestName,
      room_number: roomNumber
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
