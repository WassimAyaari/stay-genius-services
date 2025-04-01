
import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/types/messaging';

interface MessagesListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessagesList: React.FC<MessagesListProps> = ({ messages, messagesEndRef }) => {
  const formatTime = (timeString: string) => {
    if (!isNaN(Date.parse(timeString))) {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return timeString;
  };

  return (
    <ScrollArea className="flex-1 px-2 py-2">
      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id} 
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
                <p className="text-sm">{message.text}</p>
                <div 
                  className={cn(
                    "flex items-center justify-end gap-1 mt-1", 
                    message.sender === 'user' 
                      ? "text-primary-foreground/80" 
                      : "text-muted-foreground"
                  )}
                >
                  <span className="text-[10px]">
                    {formatTime(message.time)}
                  </span>
                  {message.sender === 'user' && message.status && (
                    <span className="text-[10px] ml-1">
                      {message.status === 'read' && '✓✓'}
                      {message.status === 'delivered' && '✓✓'}
                      {message.status === 'sent' && '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
