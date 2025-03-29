
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import ChatList from '@/components/admin/chat/ChatList';
import ChatDetail from '@/components/admin/chat/ChatDetail';
import DeleteChatDialog from '@/components/admin/chat/DeleteChatDialog';
import { useChatMessages } from '@/hooks/useChatMessages';

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
    getFilteredChats
  } = useChatMessages();
  
  const [currentTab, setCurrentTab] = useState('all');
  const [replyMessage, setReplyMessage] = useState('');
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

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-semibold mb-6">Chat Messages</h1>
      
      {!activeChat ? (
        <>
          <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Chats</TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({chats.reduce((count, chat) => count + (chat.unread > 0 ? 1 : 0), 0)})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <ChatList
                chats={getFilteredChats(currentTab)}
                loading={loading}
                onSelectChat={handleSelectChat}
                onDeleteClick={handleDeleteChat}
              />
            </TabsContent>
            
            <TabsContent value="unread">
              <ChatList
                chats={getFilteredChats(currentTab)}
                loading={loading}
                onSelectChat={handleSelectChat}
                onDeleteClick={handleDeleteChat}
              />
            </TabsContent>
          </Tabs>
        </>
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
