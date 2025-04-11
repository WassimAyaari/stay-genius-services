
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Chat, Message } from '@/components/admin/chat/types';

interface UseChatOperationsProps {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

export function useChatOperations({ chats, setChats }: UseChatOperationsProps) {
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSelectChat = async (chat: Chat | null) => {
    if (!chat) {
      setActiveChat(null);
      return;
    }
    
    const unreadMessages = chat.messages.filter(
      msg => msg.sender === 'user' && msg.status !== 'read'
    );
    
    if (unreadMessages.length > 0) {
      try {
        // Convert message IDs to strings to ensure compatibility
        const messageIds = unreadMessages.map(msg => String(msg.id));
        
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
        
        setChats(prevChats => prevChats.map(c => c.id === chat.id ? updatedChat : c));
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

      setChats(prevChats => prevChats.filter(chat => chat.id !== chatToDelete.id));

      toast({
        title: "Conversation deleted",
        description: `The conversation with ${chatToDelete.userInfo?.firstName || chatToDelete.userName} has been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Error",
        description: "Unable to delete the conversation.",
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
    activeChat,
    chatToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    setActiveChat,
    handleSelectChat,
    handleDeleteChat,
    confirmDelete,
    sendReply
  };
}
