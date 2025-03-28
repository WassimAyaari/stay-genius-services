
import { supabase } from '@/integrations/supabase/client';

export type ServiceType = 'room_service' | 'housekeeping' | 'maintenance' | 'laundry' | 'concierge' | 'wifi' | 'bill' | 'preferences' | 'custom';

export const requestService = async (roomId: string, type: ServiceType, description?: string, requestItemId?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase
    .from('service_requests')
    .insert({
      room_id: roomId,
      guest_id: user.id,
      type,
      description,
      request_item_id: requestItemId,
      status: 'pending'
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
