
import React, { useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useChatMessages } from './chat/useChatMessages';
import ChatHeader from './chat/ChatHeader';
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';
import { useRealtimeMessages } from '@/hooks/messaging/useRealtimeMessages';
import { toast } from 'sonner';

interface ServiceChatProps {
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
  userInfo: { name: string; roomNumber: string };
}

const ServiceChat = ({ isChatOpen, setIsChatOpen, userInfo }: ServiceChatProps) => {
  const {
    inputMessage,
    setInputMessage,
    messages,
    messagesEndRef,
    handleSendMessage,
    handleMessageSubmit,
    fetchMessages,
  } = useChatMessages(userInfo);

  // Setup realtime message updates
  useRealtimeMessages({ fetchMessages });
  
  // Listen for service request updates
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;
    
    const channel = supabase
      .channel('service_request_updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'service_requests',
        filter: `guest_id=eq.${userId}`,
      }, (payload) => {
        console.log('Service request updated:', payload);
        
        // Show a toast notification for the update
        const statusMap = {
          'pending': 'is now pending',
          'in_progress': 'is now in progress',
          'completed': 'has been completed',
          'cancelled': 'has been cancelled'
        };
        
        const status = payload.new.status;
        const message = statusMap[status] || 'has been updated';
        
        toast.info(`Request Update`, {
          description: `Your ${payload.new.type} request ${message}.`
        });
        
        // Refresh messages to show updated request status
        fetchMessages();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages]);

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
      <SheetContent className="sm:max-w-md p-0 flex flex-col h-full">
        <ChatHeader userInfo={userInfo} onClose={handleCloseChat} />
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
        <MessageInput 
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          handleMessageSubmit={handleMessageSubmit}
        />
      </SheetContent>
    </Sheet>
  );
};

export default ServiceChat;
