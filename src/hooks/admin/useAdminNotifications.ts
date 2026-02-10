import { useEffect, useState } from 'react';
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

// Category IDs from request_categories table
const CATEGORY_MAP: Record<string, SectionKey> = {
  '7beb3ccf-bbcf-4405-a397-6b6c636c955b': 'housekeeping',
  '621e423a-413f-4e8f-b471-bbd64e9c8c44': 'maintenance',
  '44b20203-fcc1-4cfc-88d9-30ef32b2f326': 'security',
  '2f96741e-3e04-4117-8d37-e94795e37a68': 'information-technology',
};

async function fetchCounts(): Promise<{ counts: Record<SectionKey, number>; restaurantCounts: Record<string, number> }> {
  const counts: Record<string, number> = {};
  SECTION_KEYS.forEach((k) => (counts[k] = 0));

  // Restaurant reservations - count all pending
  const { count: restaurantCount } = await supabase
    .from('table_reservations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');
  counts.restaurants = restaurantCount || 0;

  // Per-restaurant pending counts
  const { data: restaurantReservations } = await supabase
    .from('table_reservations')
    .select('restaurant_id')
    .eq('status', 'pending');

  const restaurantCounts: Record<string, number> = {};
  if (restaurantReservations) {
    for (const r of restaurantReservations) {
      if (r.restaurant_id) {
        restaurantCounts[r.restaurant_id] = (restaurantCounts[r.restaurant_id] || 0) + 1;
      }
    }
  }

  // Spa bookings - count all pending
  const { count: spaCount } = await supabase
    .from('spa_bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');
  counts.spa = spaCount || 0;

  // Event reservations - count all pending
  const { count: eventsCount } = await supabase
    .from('event_reservations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');
  counts.events = eventsCount || 0;

  // Service requests by category - count all pending
  const { data: serviceRequests } = await supabase
    .from('service_requests')
    .select('category_id')
    .eq('status', 'pending');

  if (serviceRequests) {
    for (const req of serviceRequests) {
      const section = CATEGORY_MAP[req.category_id || ''];
      if (section) {
        counts[section] = (counts[section] || 0) + 1;
      }
    }
  }

  return { counts: counts as Record<SectionKey, number>, restaurantCounts };
}

export function useAdminNotifications() {
  const queryClient = useQueryClient();
  const [localCounts, setLocalCounts] = useState<Record<SectionKey, number>>(() => {
    const init: Record<string, number> = {};
    SECTION_KEYS.forEach((k) => (init[k] = 0));
    return init as Record<SectionKey, number>;
  });
  const [localRestaurantCounts, setLocalRestaurantCounts] = useState<Record<string, number>>({});

  const { data } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: fetchCounts,
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (data) {
      setLocalCounts(data.counts);
      setLocalRestaurantCounts(data.restaurantCounts);
    }
  }, [data]);

  // Realtime subscriptions - listen for INSERT and UPDATE
  useEffect(() => {
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });

    const channel = supabase
      .channel('admin-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'table_reservations' }, invalidate)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'table_reservations' }, invalidate)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'spa_bookings' }, invalidate)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'spa_bookings' }, invalidate)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'event_reservations' }, invalidate)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'event_reservations' }, invalidate)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'service_requests' }, invalidate)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'service_requests' }, invalidate)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { counts: localCounts, restaurantCounts: localRestaurantCounts };
}

export type { SectionKey };
