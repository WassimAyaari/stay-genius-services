
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/features/rooms/types';

export const useServiceRequests = (roomId?: string) => {
  return useQuery({
    queryKey: ['service-requests', roomId],
    queryFn: async () => {
      let query = supabase
        .from('service_requests')
        .select('*');
      
      if (roomId) {
        query = query.eq('room_id', roomId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching service requests:", error);
        throw error;
      }
      
      return data as ServiceRequest[];
    },
    enabled: true, // Allow fetching even without roomId for admin view
  });
};
