
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseRealtimeMessagesProps {
  fetchMessages: () => void;
}

export const useRealtimeMessages = ({ fetchMessages }: UseRealtimeMessagesProps) => {
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      return;
    }
    
    // Subscribe to realtime updates for this user's messages
    const subscription = supabase
      .channel('chat_updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        console.log('New message received:', payload);
        fetchMessages();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchMessages]);
};
