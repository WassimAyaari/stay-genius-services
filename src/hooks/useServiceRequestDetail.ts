import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/features/rooms/types';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

export const useServiceRequestDetail = (requestId: string | undefined) => {
  const { user, userData } = useAuth();
  const userId = user?.id || localStorage.getItem('user_id');
  const userRoomNumber = userData?.room_number || localStorage.getItem('user_room_number');

  const fetchServiceRequestDetail = async (): Promise<ServiceRequest | null> => {
    if (!requestId) {
      console.log('No request ID provided');
      return null;
    }

    console.log('Fetching service request detail for ID:', requestId);
    console.log('User context:', { userId, userRoomNumber });

    try {
      // First try to fetch by ID with user filtering
      let query = supabase
        .from('service_requests')
        .select('*')
        .eq('id', requestId);

      // If we have a user ID, filter by it for security
      if (userId) {
        query = query.eq('guest_id', userId);
      } else if (userRoomNumber) {
        // If no user ID but we have room number, filter by room number
        query = query.eq('room_number', userRoomNumber);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error('Error fetching service request detail:', error);
        throw error;
      }

      console.log('Service request detail fetched:', data);
      return data as ServiceRequest;
    } catch (error) {
      console.error('Error in fetchServiceRequestDetail:', error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['serviceRequestDetail', requestId, userId, userRoomNumber],
    queryFn: fetchServiceRequestDetail,
    enabled: !!requestId,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: false,
  });
};