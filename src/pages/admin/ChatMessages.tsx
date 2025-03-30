
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import ChatList from '@/components/admin/chat/ChatList';
import ChatDetail from '@/components/admin/chat/ChatDetail';
import DeleteChatDialog from '@/components/admin/chat/DeleteChatDialog';
import { useChatMessages } from '@/hooks/useChatMessages';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/features/rooms/types';
import { Chat, Message } from '@/components/admin/chat/types';

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
    fetchChats,
    currentTab,
    setCurrentTab
  } = useChatMessages();
  
  const [replyMessage, setReplyMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  // Fetch service requests to display as messages
  useEffect(() => {
    const fetchServiceRequests = async () => {
      setIsLoadingRequests(true);
      try {
        const { data, error } = await supabase
          .from('service_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching service requests for messages:', error);
          throw error;
        }

        setServiceRequests(data as ServiceRequest[]);
        
        // Convert service requests to chat format and merge with existing chats
        const requestChats = convertRequestsToChats(data as ServiceRequest[]);
        
        // This will happen in the useChatMessages hook
        // Functionality remains in the hook
      } catch (error) {
        console.error('Error in fetchServiceRequests:', error);
      } finally {
        setIsLoadingRequests(false);
      }
    };

    fetchServiceRequests();
  }, []);

  // Helper function to convert service requests to chat format
  const convertRequestsToChats = (requests: ServiceRequest[]): Chat[] => {
    const groupedRequests: Record<string, ServiceRequest[]> = {};
    
    // Group requests by guest_id or room_id
    requests.forEach(request => {
      const key = request.guest_id || request.room_id;
      if (!groupedRequests[key]) {
        groupedRequests[key] = [];
      }
      groupedRequests[key].push(request);
    });
    
    // Convert each group to a chat
    return Object.entries(groupedRequests).map(([userId, userRequests]) => {
      const latestRequest = userRequests[0];
      
      // Create messages from requests
      const messages: Message[] = userRequests.map(request => ({
        id: request.id,
        text: `${request.type} request: ${request.description || 'No description'}`,
        time: new Date(request.created_at).toLocaleString(),
        sender: 'user',
        status: 'sent',
        type: 'request',
        requestType: request.type,
        requestStatus: request.status
      }));
      
      return {
        id: userId,
        userId: latestRequest.guest_id || '',
        userName: latestRequest.guest_name || 'Guest',
        roomNumber: latestRequest.room_number || '',
        lastActivity: new Date(latestRequest.created_at).toISOString(),
        messages,
        unread: messages.length,
        type: 'request'
      };
    });
  };

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
        description: "The messages have been refreshed.",
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
        <h1 className="text-2xl font-semibold">Messages</h1>
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
          loading={loading || isLoadingRequests}
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
