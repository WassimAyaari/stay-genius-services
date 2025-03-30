
import { useState, useEffect } from 'react';
import { Chat } from '@/components/admin/chat/types';
import { useChatFetching } from './useChatFetching';
import { useChatOperations } from './useChatOperations';
import { useLocation } from 'react-router-dom';

export function useChatMessages() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  
  const [currentTab, setCurrentTab] = useState(tabFromUrl || 'all');
  const { chats, loading, setChats, fetchChats } = useChatFetching();
  
  useEffect(() => {
    if (tabFromUrl) {
      setCurrentTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  
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
    if (tab === 'messages') return chats.filter(chat => !chat.type || chat.type === 'chat');
    if (tab === 'requests') return chats.filter(chat => chat.type === 'request');
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
    fetchChats,
    currentTab,
    setCurrentTab
  };
}
