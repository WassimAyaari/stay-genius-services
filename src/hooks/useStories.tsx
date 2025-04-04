
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Story } from '@/types/event';
import { useToast } from '@/hooks/use-toast';

export const useStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchStories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stories'));
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load stories"
      });
    } finally {
      setLoading(false);
    }
  };

  const createStory = async (story: Omit<Story, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .insert([story])
        .select()
        .single();

      if (error) throw error;
      setStories(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Story created successfully"
      });
      return data;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create story"
      });
      throw err;
    }
  };

  const updateStory = async (id: string, updates: Partial<Story>) => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setStories(prev => prev.map(story => story.id === id ? data : story));
      toast({
        title: "Success",
        description: "Story updated successfully"
      });
      return data;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update story"
      });
      throw err;
    }
  };

  const deleteStory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setStories(prev => prev.filter(story => story.id !== id));
      toast({
        title: "Success",
        description: "Story deleted successfully"
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete story"
      });
      throw err;
    }
  };

  const markAsSeen = async (id: string) => {
    await updateStory(id, { seen: true });
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return {
    stories,
    loading,
    error,
    fetchStories,
    createStory,
    updateStory,
    deleteStory,
    markAsSeen
  };
};
