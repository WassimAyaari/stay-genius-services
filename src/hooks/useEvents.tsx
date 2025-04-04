
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/event';
import { useToast } from './use-toast';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Properly cast the data to ensure it matches the Event type
      setEvents(data as Event[]);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch events',
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
        .select();

      if (error) throw error;
      
      setEvents(prev => [...prev, ...(data as Event[])]);
      
      toast({
        title: 'Success',
        description: 'Event created successfully',
      });
      
      return data[0];
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create event',
      });
      throw error;
    }
  };

  const updateEvent = async (id: string, event: Partial<Event>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(event)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      setEvents(prev => prev.map(e => e.id === id ? { ...e, ...data[0] } as Event : e));
      
      toast({
        title: 'Success',
        description: 'Event updated successfully',
      });
      
      return data[0];
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update event',
      });
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setEvents(prev => prev.filter(e => e.id !== id));
      
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete event',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
