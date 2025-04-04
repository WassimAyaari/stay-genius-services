
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/event';
import { useToast } from '@/hooks/use-toast';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch events'));
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load events"
      });
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([event])
        .select()
        .single();

      if (error) throw error;
      setEvents(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Event created successfully"
      });
      return data;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create event"
      });
      throw err;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setEvents(prev => prev.map(event => event.id === id ? data : event));
      toast({
        title: "Success",
        description: "Event updated successfully"
      });
      return data;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update event"
      });
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEvents(prev => prev.filter(event => event.id !== id));
      toast({
        title: "Success",
        description: "Event deleted successfully"
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete event"
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };
};
