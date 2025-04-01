
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Chat, Message, UserInfo } from '@/components/admin/chat/types';
import { formatTimeAgo } from '@/utils/dateUtils';

export function useChatFetching() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setLoading(true);
    try {
      // Fetch all chat messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('user_id, user_name, room_number')
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Process chat messages
      const uniqueUsers = new Map();
      
      // Process regular chat messages
      messagesData?.forEach(msg => {
        if (msg.user_id && !uniqueUsers.has(msg.user_id)) {
          uniqueUsers.set(msg.user_id, {
            userId: msg.user_id,
            userName: msg.user_name || 'Guest',
            roomNumber: msg.room_number,
          });
        }
      });

      const filteredUsers = Array.from(uniqueUsers.values()).filter(user => user.userId);
      
      const userChats: Chat[] = [];
      
      for (const userInfo of filteredUsers) {
        let userDetails: UserInfo = {};
        
        try {
          const userData = localStorage.getItem(`user_data_${userInfo.userId}`);
          if (userData) {
            const parsedData = JSON.parse(userData);
            userDetails = {
              firstName: parsedData.firstName || parsedData.name?.split(' ')[0],
              lastName: parsedData.lastName || parsedData.name?.split(' ')[1],
              roomNumber: parsedData.roomNumber || userInfo.roomNumber
            };
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }

        // Fetch user's chat messages
        const { data: userMessages, error: userMessagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .or(`user_id.eq.${userInfo.userId},recipient_id.eq.${userInfo.userId}`)
          .order('created_at', { ascending: true });

        if (userMessagesError) {
          console.error('Error fetching user messages:', userMessagesError);
          continue;
        }

        // Format chat messages
        const formattedMessages: Message[] = [];
        
        // Add chat messages
        if (userMessages && userMessages.length > 0) {
          formattedMessages.push(...userMessages.map(msg => ({
            id: msg.id,
            text: msg.text,
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: msg.sender as 'user' | 'staff',
            status: msg.status as 'sent' | 'delivered' | 'read' | undefined
          })));
        }

        // Calculate unread count
        const unreadCount = formattedMessages.filter(
          msg => msg.sender === 'user' && msg.status !== 'read'
        ).length || 0;

        // Only add users who have messages
        if (formattedMessages.length > 0) {
          const lastMessage = formattedMessages[formattedMessages.length - 1];
          const lastActivity = lastMessage 
            ? formatTimeAgo(new Date(lastMessage.time))
            : 'No activity';

          const displayRoomNumber = userInfo.roomNumber || userDetails.roomNumber || '';

          userChats.push({
            id: userInfo.userId,
            userId: userInfo.userId,
            userName: userInfo.userName,
            roomNumber: displayRoomNumber,
            lastActivity: lastActivity,
            messages: formattedMessages,
            unread: unreadCount,
            userInfo: userDetails
          });
        }
      }

      setChats(userChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast({
        title: "Error loading chats",
        description: "There was a problem loading the chat data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    chats,
    loading,
    setChats,
    fetchChats
  };
}
