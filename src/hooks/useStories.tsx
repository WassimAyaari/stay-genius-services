
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Story } from '@/types/event';
import { useToast } from './use-toast';

export const useStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Properly cast the data to ensure it matches the Story type
      setStories(data as Story[]);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch stories',
      });
    } finally {
      setLoading(false);
    }
  };

  const createStory = async (story: Omit<Story, 'id' | 'created_at' | 'updated_at' | 'seen'>) => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .insert([{
          ...story,
          seen: false
        }])
        .select();

      if (error) throw error;
      
      setStories(prev => [...prev, ...(data as Story[])]);
      
      toast({
        title: 'Success',
        description: 'Story created successfully',
      });
      
      return data[0];
    } catch (error) {
      console.error('Error creating story:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create story',
      });
      throw error;
    }
  };

  const updateStory = async (id: string, story: Partial<Story>) => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .update(story)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      setStories(prev => prev.map(s => s.id === id ? { ...s, ...data[0] } as Story : s));
      
      toast({
        title: 'Success',
        description: 'Story updated successfully',
      });
      
      return data[0];
    } catch (error) {
      console.error('Error updating story:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update story',
      });
      throw error;
    }
  };

  const deleteStory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setStories(prev => prev.filter(s => s.id !== id));
      
      toast({
        title: 'Success',
        description: 'Story deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting story:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete story',
      });
      throw error;
    }
  };

  const markAsSeen = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stories')
        .update({ seen: true })
        .eq('id', id);

      if (error) throw error;
      
      setStories(prev => prev.map(s => s.id === id ? { ...s, seen: true } as Story : s));
    } catch (error) {
      console.error('Error marking story as seen:', error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return {
    stories,
    loading,
    fetchStories,
    createStory,
    updateStory,
    deleteStory,
    markAsSeen,
  };
};
