
import { supabase } from '@/integrations/supabase/client';

export type ServiceType = 'room_service' | 'housekeeping' | 'maintenance' | 'laundry' | 'concierge' | 'wifi' | 'bill' | 'preferences' | 'custom';

export const requestService = async (roomId: string, type: ServiceType, description?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase
    .from('service_requests')
    .insert({
      room_id: roomId,
      guest_id: user.id,
      type,
      description,
      status: 'pending'
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};
