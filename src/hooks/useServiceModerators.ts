import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceModerator {
  user_id: string;
  name: string;
}

export function useServiceModerators(serviceType: string) {
  return useQuery({
    queryKey: ['service-moderators', serviceType],
    queryFn: async (): Promise<ServiceModerator[]> => {
      // Get moderator user_ids for this service type
      const { data: moderatorServices, error: msError } = await supabase
        .from('moderator_services')
        .select('user_id')
        .eq('service_type', serviceType);

      if (msError) throw msError;
      if (!moderatorServices || moderatorServices.length === 0) return [];

      const userIds = moderatorServices.map(ms => ms.user_id);

      // Get names from guests table
      const { data: guests, error: gError } = await supabase
        .from('guests')
        .select('user_id, first_name, last_name')
        .in('user_id', userIds);

      if (gError) throw gError;

      const guestMap = new Map(
        (guests || []).map(g => [g.user_id, `${g.first_name} ${g.last_name}`])
      );

      return userIds.map(uid => ({
        user_id: uid,
        name: guestMap.get(uid) || 'Unknown',
      }));
    },
    staleTime: 60000,
  });
}
