
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/event';
import { format } from 'date-fns';

export const useTodayHighlights = () => {
  const [todayEvents, setTodayEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodayEvents = useCallback(async () => {
    try {
      setLoading(true);
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Fetch events for today (one-time events with today's date OR daily recurring events)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .or(`and(date.eq.${today},recurrence_type.eq.once),recurrence_type.eq.daily`)
        .order('time', { ascending: true });

      if (error) throw error;
      
      setTodayEvents(data as Event[]);
    } catch (error) {
      console.error('Error fetching today events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayEvents();
  }, [fetchTodayEvents]);

  return {
    todayEvents,
    loading,
    fetchTodayEvents,
  };
};
