import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const SECTION_KEYS = [
  'restaurants',
  'spa',
  'events',
  'housekeeping',
  'maintenance',
  'security',
  'information-technology',
] as const;

type SectionKey = (typeof SECTION_KEYS)[number];

const ROUTE_TO_SECTION: Record<string, SectionKey> = {
  '/admin/restaurants': 'restaurants',
  '/admin/spa': 'spa',
  '/admin/events': 'events',
  '/admin/housekeeping': 'housekeeping',
  '/admin/maintenance': 'maintenance',
  '/admin/security': 'security',
  '/admin/information-technology': 'information-technology',
};

// Category IDs from request_categories table
const CATEGORY_MAP: Record<string, SectionKey> = {
  '7beb3ccf-bbcf-4405-a397-6b6c636c955b': 'housekeeping',
  '621e423a-413f-4e8f-b471-bbd64e9c8c44': 'maintenance',
  '44b20203-fcc1-4cfc-88d9-30ef32b2f326': 'security',
  '2f96741e-3e04-4117-8d37-e94795e37a68': 'information-technology',
};

const CATEGORY_NAME_TO_SECTION: Record<string, SectionKey> = {
  'Housekeeping': 'housekeeping',
  'Maintenance': 'maintenance',
  'Security': 'security',
  'Information Technology': 'information-technology',
};

function getLastSeen(section: string): string {
  return localStorage.getItem(`admin_lastSeen_${section}`) || '1970-01-01T00:00:00.000Z';
}

function setLastSeen(section: string) {
  localStorage.setItem(`admin_lastSeen_${section}`, new Date().toISOString());
}

async function fetchCounts(): Promise<Record<SectionKey, number>> {
  const counts: Record<string, number> = {};
  SECTION_KEYS.forEach((k) => (counts[k] = 0));

  // Restaurant reservations
  const restaurantLastSeen = getLastSeen('restaurants');
  const { count: restaurantCount } = await supabase
    .from('table_reservations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')
    .gt('created_at', restaurantLastSeen);
  counts.restaurants = restaurantCount || 0;

  // Spa bookings
  const spaLastSeen = getLastSeen('spa');
  const { count: spaCount } = await supabase
    .from('spa_bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')
    .gt('created_at', spaLastSeen);
  counts.spa = spaCount || 0;

  // Event reservations
  const eventsLastSeen = getLastSeen('events');
  const { count: eventsCount } = await supabase
    .from('event_reservations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')
    .gt('created_at', eventsLastSeen);
  counts.events = eventsCount || 0;

  // Service requests by category
  const { data: serviceRequests } = await supabase
    .from('service_requests')
    .select('category_id, created_at')
    .eq('status', 'pending');

  if (serviceRequests) {
    for (const req of serviceRequests) {
      const section = CATEGORY_MAP[req.category_id || ''];
      if (section) {
        const lastSeen = getLastSeen(section);
        if (req.created_at && req.created_at > lastSeen) {
          counts[section] = (counts[section] || 0) + 1;
        }
      }
    }
  }

  return counts as Record<SectionKey, number>;
}

export function useAdminNotifications() {
  const queryClient = useQueryClient();
  const [localCounts, setLocalCounts] = useState<Record<SectionKey, number>>(() => {
    const init: Record<string, number> = {};
    SECTION_KEYS.forEach((k) => (init[k] = 0));
    return init as Record<SectionKey, number>;
  });

  const { data: counts } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: fetchCounts,
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (counts) {
      setLocalCounts(counts);
    }
  }, [counts]);

  // Mark section as seen
  const markSeen = useCallback(
    (section: SectionKey) => {
      setLastSeen(section);
      setLocalCounts((prev) => ({ ...prev, [section]: 0 }));
      // Refetch after a short delay to sync
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ['admin-notifications'] }), 500);
    },
    [queryClient]
  );

  // Realtime subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'table_reservations' },
        () => queryClient.invalidateQueries({ queryKey: ['admin-notifications'] })
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'spa_bookings' },
        () => queryClient.invalidateQueries({ queryKey: ['admin-notifications'] })
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'event_reservations' },
        () => queryClient.invalidateQueries({ queryKey: ['admin-notifications'] })
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'service_requests' },
        () => queryClient.invalidateQueries({ queryKey: ['admin-notifications'] })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { counts: localCounts, markSeen };
}

export type { SectionKey };
