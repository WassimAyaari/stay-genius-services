
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/event';
import { format } from 'date-fns';

export const useTodayHighlights = () => {
  const [todayEvents, setTodayEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTodayHighlights = async () => {
    try {
      setLoading(true);
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('date', today)
        .order('time', { ascending: true });

      if (error) throw error;
      setTodayEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch today\'s events'));
      console.error('Error fetching today highlights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayHighlights();
  }, []);

  return { todayEvents, loading, error, fetchTodayHighlights };
};
