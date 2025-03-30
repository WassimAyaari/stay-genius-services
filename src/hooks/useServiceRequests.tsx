
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/features/rooms/types';

export const useServiceRequests = (roomId?: string) => {
  return useQuery({
    queryKey: ['service-requests', roomId],
    queryFn: async () => {
      console.log("Fetching service requests for roomId:", roomId);
      
      let query = supabase
        .from('service_requests')
        .select(`
          *,
          request_items(*),
          profiles:guest_id(first_name, last_name)
        `);
      
      if (roomId) {
        query = query.eq('room_id', roomId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching service requests:", error);
        throw error;
      }
      
      console.log("Raw service requests data:", data);
      
      // Transform data to include guest_name and room_number properties
      const transformedData = await Promise.all(data.map(async (request: any) => {
        // Initialize transformed request with explicit room_number property
        let transformedRequest = {
          ...request,
          guest_name: request.profiles ? 
            `${request.profiles.first_name || ''} ${request.profiles.last_name || ''}`.trim() : 
            'Unknown Guest',
          room_number: request.room_number || undefined // Use existing room_number if available
        };
        
        // If no room_number exists and room_id exists, try to get the room_number
        if (!transformedRequest.room_number && request.room_id) {
          const { data: roomData } = await supabase
            .from('rooms')
            .select('room_number')
            .eq('id', request.room_id)
            .maybeSingle();
            
          if (roomData) {
            transformedRequest.room_number = roomData.room_number;
          }
        }
        
        return transformedRequest;
      }));
      
      console.info("Transformed service requests:", transformedData);
      return transformedData as ServiceRequest[];
    },
    enabled: true, // Allow fetching even without roomId for admin view
    refetchOnWindowFocus: false, // Prevent excessive refetches
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
  });
};
