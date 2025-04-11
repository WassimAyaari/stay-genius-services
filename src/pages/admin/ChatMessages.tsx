
import React from 'react';
import { useChatMessages } from '@/hooks/useChatMessages';
import ChatMessagesContainer from '@/components/admin/chat/ChatMessagesContainer';
import Layout from '@/components/Layout';

const ChatMessages = () => {
  const {
    chats,
    activeChat,
    loading,
    chatToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleSelectChat,
    handleDeleteChat,
    confirmDelete,
    sendReply,
    getFilteredChats,
    fetchChats,
    currentTab,
    setCurrentTab
  } = useChatMessages();

  return (
    <Layout>
      <ChatMessagesContainer
        chats={chats}
        activeChat={activeChat}
        loading={loading}
        getFilteredChats={getFilteredChats}
        fetchChats={fetchChats}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        handleSelectChat={handleSelectChat}
        handleDeleteChat={handleDeleteChat}
        sendReply={sendReply}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        chatToDelete={chatToDelete}
        confirmDelete={confirmDelete}
      />
    </Layout>
  );
};

export default ChatMessages;
