import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/event';
import { useToast } from './use-toast';
import { isBefore, startOfDay } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

export const useEvents = () => {
  const { toast } = useToast();
  
  const { data: events = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      console.log('Fetching events from Supabase...');
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error in fetchEvents:', error);
        throw error;
      }
      
      console.log('Events fetched successfully:', data);
      return data as Event[];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const upcomingEvents = useMemo(() => {
    const today = startOfDay(new Date());
    return (events || []).filter(event => {
      const eventDate = startOfDay(new Date(event.date));
      return !isBefore(eventDate, today);
    });
  }, [events]);

  const createEvent = useCallback(async (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
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
      
      await refetch();
      
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
  }, [toast, refetch]);

  const updateEvent = useCallback(async (id: string, event: Partial<Event>) => {
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
      
      await refetch();
      
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
  }, [toast, refetch]);

  const deleteEvent = useCallback(async (id: string) => {
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
      
      await refetch();
      
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
  }, [toast, refetch]);

  return {
    events,
    upcomingEvents,
    loading,
    error,
    fetchEvents: refetch,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
