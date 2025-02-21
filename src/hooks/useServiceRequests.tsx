
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/features/rooms/types';

export const useServiceRequests = (roomId?: string) => {
  return useQuery({
    queryKey: ['service-requests', roomId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ServiceRequest[];
    },
    enabled: !!roomId,
  });
};
