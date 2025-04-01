
import React, { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';

interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'user' | 'staff';
  status?: 'sent' | 'delivered' | 'read';
  type?: 'request' | 'message';
  requestStatus?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  requestType?: string;
}

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, messagesEndRef }) => {
  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, messagesEndRef]);

  // Group messages by date for better readability
  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div className="flex justify-center items-center h-full py-8">
          <p className="text-muted-foreground text-sm">No messages yet. Start a conversation!</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  };

  return (
    <ScrollArea className="flex-1 px-4 py-3">
      {renderMessages()}
    </ScrollArea>
  );
};

export default MessageList;
