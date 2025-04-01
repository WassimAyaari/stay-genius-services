
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useChatMessages } from './chat/useChatMessages';
import ChatHeader from './chat/ChatHeader';
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';

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
  } = useChatMessages(userInfo);

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
