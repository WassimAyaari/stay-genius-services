
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/features/rooms/types';

export const useServiceRequests = (roomId?: string) => {
  return useQuery({
    queryKey: ['service-requests', roomId],
    queryFn: async () => {
      console.log("Fetching service requests for roomId:", roomId);
      
      try {
        let query = supabase
          .from('service_requests')
          .select(`
            *,
            request_items(*)
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
        
        // Transform data to add guest_name and room_number properties if not already present
        const transformedData = await Promise.all(data.map(async (request: any) => {
          // If guest_name and room_number are already present, use them
          if (request.guest_name && request.room_number) {
            return request;
          }
          
          // Get the room number if needed
          let room_number = request.room_number;
          if (!room_number && request.room_id) {
            try {
              const { data: roomData } = await supabase
                .from('rooms')
                .select('room_number')
                .eq('id', request.room_id)
                .maybeSingle();
                
              if (roomData) {
                room_number = roomData.room_number;
              }
            } catch (roomError) {
              console.error("Error fetching room info:", roomError);
            }
          }
          
          // Create guest name from profiles if available
          let guest_name = request.guest_name || 'Unknown Guest';
          
          // Return transformed request with guest_name and room_number
          return {
            ...request,
            guest_name,
            room_number
          };
        }));
        
        console.info("Transformed service requests:", transformedData);
        return transformedData as ServiceRequest[];
      } catch (error) {
        console.error("Error in useServiceRequests:", error);
        throw error;
      }
    },
    enabled: true, // Allow fetching even without roomId for admin view
    refetchOnWindowFocus: false, // Prevent excessive refetches
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
  });
};
