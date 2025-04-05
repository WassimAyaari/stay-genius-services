
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
      console.log('Fetching events from Supabase...');
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error in fetchEvents:', error);
        throw error;
      }
      
      console.log('Events fetched successfully:', data);
      
      // Properly cast the data to ensure it matches the Event type
      setEvents(data as Event[]);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de récupérer les événements',
      });
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating new event:', event);
      
      const { data, error } = await supabase
        .from('events')
        .insert([event])
        .select();

      if (error) {
        console.error('Error in createEvent:', error);
        throw error;
      }
      
      console.log('Event created successfully:', data);
      
      setEvents(prev => [...prev, ...(data as Event[])]);
      
      toast({
        title: 'Succès',
        description: 'Événement créé avec succès',
      });
      
      return data[0];
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de créer l\'événement',
      });
      throw error;
    }
  };

  const updateEvent = async (id: string, event: Partial<Event>) => {
    try {
      console.log('Updating event:', id, event);
      
      const { data, error } = await supabase
        .from('events')
        .update(event)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error in updateEvent:', error);
        throw error;
      }
      
      console.log('Event updated successfully:', data);
      
      setEvents(prev => prev.map(e => e.id === id ? { ...e, ...data[0] } as Event : e));
      
      toast({
        title: 'Succès',
        description: 'Événement mis à jour avec succès',
      });
      
      return data[0];
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour l\'événement',
      });
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      console.log('Deleting event:', id);
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error in deleteEvent:', error);
        throw error;
      }
      
      console.log('Event deleted successfully');
      
      setEvents(prev => prev.filter(e => e.id !== id));
      
      toast({
        title: 'Succès',
        description: 'Événement supprimé avec succès',
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer l\'événement',
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
