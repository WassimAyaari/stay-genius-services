
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'user' | 'staff';
  status?: 'sent' | 'delivered' | 'read';
  type?: 'request' | 'message';
  requestType?: string;
  requestStatus?: string;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const formatTime = (timeString: string) => {
    if (!isNaN(Date.parse(timeString))) {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return timeString;
  };

  return (
    <div
      className={cn(
        "flex",
        message.sender === 'user' ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] px-4 py-2 rounded-2xl mb-1",
          message.sender === 'user'
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-muted rounded-tl-none"
        )}
      >
        {message.type === 'request' && message.requestType && (
          <div className="font-medium mb-1 text-sm">
            {message.requestType} Request
          </div>
        )}
        <p className="break-words text-sm">{message.text}</p>
        <div
          className={cn(
            "flex items-center justify-end gap-1 mt-1",
            message.sender === 'user'
              ? "text-primary-foreground/80"
              : "text-muted-foreground"
          )}
        >
          <span className="text-[10px]">{formatTime(message.time)}</span>
          {message.sender === 'user' && message.status && (
            <Check className="h-3 w-3" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
