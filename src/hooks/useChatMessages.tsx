import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Chat, ChatMessage, Message, UserInfo } from '@/components/admin/chat/types';

export function useChatMessages() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchChats();
  }, []);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hrs ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const fetchChats = async () => {
    setLoading(true);
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('user_id, user_name, room_number')
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      const uniqueUsers = new Map();
      
      messagesData?.forEach(msg => {
        if (msg.user_id && !uniqueUsers.has(msg.user_id)) {
          uniqueUsers.set(msg.user_id, {
            userId: msg.user_id,
            userName: msg.user_name || 'Guest',
            roomNumber: msg.room_number
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

        const { data: userMessages, error: userMessagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .or(`user_id.eq.${userInfo.userId},recipient_id.eq.${userInfo.userId}`)
          .order('created_at', { ascending: true });

        if (userMessagesError) {
          console.error('Error fetching user messages:', userMessagesError);
          continue;
        }

        if (!userMessages || userMessages.length === 0) continue;

        const unreadCount = userMessages.filter(
          msg => msg.sender === 'user' && msg.status !== 'read'
        ).length || 0;

        const lastMessage = userMessages[userMessages.length - 1];
        const lastActivity = lastMessage 
          ? formatTimeAgo(new Date(lastMessage.created_at))
          : 'No activity';

        const formattedMessages: Message[] = userMessages.map(msg => ({
          id: msg.id,
          text: msg.text,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: msg.sender as 'user' | 'staff',
          status: msg.status as 'sent' | 'delivered' | 'read' | undefined
        }));

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

  const handleSelectChat = async (chat: Chat) => {
    const unreadMessages = chat.messages.filter(
      msg => msg.sender === 'user' && msg.status !== 'read'
    );
    
    if (unreadMessages.length > 0) {
      try {
        const messageIds = unreadMessages.map(msg => msg.id);
        
        const { error } = await supabase
          .from('chat_messages')
          .update({ status: 'read' })
          .in('id', messageIds);
          
        if (error) throw error;
        
        const updatedMessages = chat.messages.map(msg => {
          if (msg.sender === 'user' && msg.status !== 'read') {
            return { ...msg, status: 'read' as const };
          }
          return msg;
        });
        
        const updatedChat = {
          ...chat,
          unread: 0,
          messages: updatedMessages
        };
        
        setChats(chats.map(c => c.id === chat.id ? updatedChat : c));
        setActiveChat(updatedChat);
      } catch (error) {
        console.error('Error marking messages as read:', error);
        toast({
          title: "Error",
          description: "Could not mark messages as read.",
          variant: "destructive"
        });
        setActiveChat(chat);
      }
    } else {
      setActiveChat(chat);
    }
  };

  const handleDeleteChat = (chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatToDelete(chat);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!chatToDelete) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .or(`user_id.eq.${chatToDelete.userId},recipient_id.eq.${chatToDelete.userId}`);

      if (error) throw error;

      if (activeChat && activeChat.id === chatToDelete.id) {
        setActiveChat(null);
      }

      setChats(chats.filter(chat => chat.id !== chatToDelete.id));

      toast({
        title: "Conversation supprimée",
        description: `La conversation avec ${chatToDelete.userInfo?.firstName || chatToDelete.userName} a été supprimée.`,
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la conversation.",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setChatToDelete(null);
    }
  };

  const sendReply = async (activeChat: Chat, replyMessage: string) => {
    const newMessage = {
      text: replyMessage,
      sender: 'staff' as const,
      user_id: activeChat.userId,
      user_name: activeChat.userName,
      recipient_id: activeChat.userId,
      room_number: activeChat.roomNumber,
      status: 'sent',
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert(newMessage)
        .select();

      if (error) throw error;

      const sentMessage: Message = {
        id: data[0].id,
        text: replyMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'staff',
        status: 'sent'
      };

      const updatedChat = {
        ...activeChat,
        messages: [...activeChat.messages, sentMessage],
        lastActivity: 'just now'
      };

      setChats(prevChats => prevChats.map(chat => 
        chat.id === activeChat.id ? updatedChat : chat
      ));
      
      setActiveChat(updatedChat);

      return {
        success: true,
        userName: activeChat.userInfo?.firstName || activeChat.userName
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false };
    }
  };

  return {
    chats,
    activeChat,
    loading,
    chatToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    setActiveChat,
    handleSelectChat,
    handleDeleteChat,
    confirmDelete,
    sendReply,
    getFilteredChats: (currentTab: string) => {
      if (currentTab === 'all') return chats;
      if (currentTab === 'unread') return chats.filter(chat => chat.unread > 0);
      return chats;
    }
  };
}
