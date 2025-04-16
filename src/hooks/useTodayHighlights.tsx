
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
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('date', today)
        .order('time', { ascending: true });

      if (error) throw error;
      
      // Ajouter un délai pour les tests (à retirer en production)
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
