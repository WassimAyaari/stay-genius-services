
import { useState } from 'react';
import { Chat } from '@/components/admin/chat/types';
import { useChatFetching } from './useChatFetching';
import { useChatOperations } from './useChatOperations';

export function useChatMessages() {
  const [currentTab, setCurrentTab] = useState('all');
  const { chats, loading, setChats, fetchChats } = useChatFetching();
  
  const {
    activeChat,
    chatToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    setActiveChat,
    handleSelectChat,
    handleDeleteChat,
    confirmDelete,
    sendReply
  } = useChatOperations({ chats, setChats });

  const getFilteredChats = (tab: string) => {
    if (tab === 'all') return chats;
    if (tab === 'unread') return chats.filter(chat => chat.unread > 0);
    return chats;
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
    getFilteredChats,
    fetchChats
  };
}
