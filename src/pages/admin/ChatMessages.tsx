
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import ChatList from '@/components/admin/chat/ChatList';
import ChatDetail from '@/components/admin/chat/ChatDetail';
import DeleteChatDialog from '@/components/admin/chat/DeleteChatDialog';
import { useChatMessages } from '@/hooks/useChatMessages';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const ChatMessages = () => {
  const {
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
  } = useChatMessages();
  
  const [currentTab, setCurrentTab] = useState('all');
  const [replyMessage, setReplyMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !activeChat) return;

    const result = await sendReply(activeChat, replyMessage);
    
    if (result.success) {
      setReplyMessage('');
      toast({
        title: "Message sent",
        description: "Your reply has been sent to " + result.userName,
      });
    } else {
      toast({
        title: "Error sending message",
        description: "Your message could not be sent. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBackToList = () => {
    setActiveChat(null);
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchChats();
      toast({
        title: "Data refreshed",
        description: "The messages and requests have been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Error refreshing data",
        description: "There was a problem refreshing the data.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Messages & Requests</h1>
        {!activeChat && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>
      
      {!activeChat ? (
        <ChatList
          chats={getFilteredChats(currentTab)}
          loading={loading}
          onSelectChat={handleSelectChat}
          onDeleteClick={handleDeleteChat}
          activeTab={currentTab}
          onTabChange={handleTabChange}
        />
      ) : (
        <ChatDetail
          activeChat={activeChat}
          replyMessage={replyMessage}
          setReplyMessage={setReplyMessage}
          onSendReply={handleSendReply}
          onBackToList={handleBackToList}
          onDeleteClick={handleDeleteChat}
        />
      )}

      <DeleteChatDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        chatToDelete={chatToDelete}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};

export default ChatMessages;
