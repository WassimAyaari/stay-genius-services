import React, { useRef, useState, useEffect } from 'react';
import { Send, ChevronLeft, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Chat, Message } from './types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ChatDetailProps {
  chat: Chat | null;
  onBack: () => void;
  onSendReply: (chat: Chat, message: string) => Promise<{success: boolean, userName?: string}>;
}

const ChatDetail = ({ chat, onBack, onSendReply }: ChatDetailProps) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!message.trim() || !chat) return;
    
    setIsSending(true);
    try {
      const result = await onSendReply(chat, message);
      if (result.success) {
        setMessage('');
        toast({
          title: "Message sent",
          description: `Your reply to ${result.userName || 'the guest'} has been sent.`,
        });
      } else {
        toast({
          title: "Error sending message",
          description: "There was a problem sending your message. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "There was a problem sending your message.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatMessageTime = (time: string) => {
    try {
      // If it's already a time string, return it
      if (time.includes(':')) return time;
      
      // Otherwise try to parse and format
      return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting time:', error);
      return time;
    }
  };

  const formatMessageDate = (time: string) => {
    try {
      // Try to parse as date
      const date = new Date(time);
      if (isNaN(date.getTime())) return null;
      
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Format based on when the message was sent
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString(undefined, { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric'
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };
  
  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  
  if (chat?.messages.length) {
    let currentDate = '';
    let currentGroup: Message[] = [];
    
    chat.messages.forEach(msg => {
      const messageDate = formatMessageDate(msg.time) || 'Unknown Date';
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groupedMessages.push({
            date: currentDate,
            messages: currentGroup
          });
          currentGroup = [];
        }
        currentDate = messageDate;
      }
      
      currentGroup.push(msg);
    });
    
    // Push the last group
    if (currentGroup.length > 0) {
      groupedMessages.push({
        date: currentDate,
        messages: currentGroup
      });
    }
  }
  
  if (!chat) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 bg-opacity-50">
        <div className="text-center p-8">
          <h3 className="text-lg font-medium text-gray-600">Select a conversation</h3>
          <p className="text-gray-500 mt-2">Choose a conversation from the list to view messages</p>
        </div>
      </div>
    );
  }
  
  const userInitials = chat.userInfo?.firstName 
    ? `${chat.userInfo.firstName.charAt(0)}${chat.userInfo.lastName ? chat.userInfo.lastName.charAt(0) : ''}`
    : chat.userName.slice(0, 2).toUpperCase();
  
  const displayName = chat.userInfo?.firstName
    ? `${chat.userInfo.firstName} ${chat.userInfo.lastName || ''}`
    : chat.userName;
    
  return (
    <div className="flex flex-col h-full bg-gray-50 bg-opacity-50">
      <div className="flex items-center p-4 border-b bg-white">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2" 
          onClick={onBack}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-9 w-9 mr-3">
          <AvatarImage src={chat.userInfo?.avatar} />
          <AvatarFallback className="bg-primary text-white text-xs">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-medium">{displayName}</div>
          <div className="text-xs text-gray-500">
            {chat.roomNumber && `Room ${chat.roomNumber}`}
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-xs text-gray-500">{group.date}</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
              
              {group.messages.map((msg, index) => (
                <div
                  key={`${msg.id}-${index}`}
                  className={cn(
                    "flex",
                    msg.sender === 'staff' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] px-4 py-2 rounded-2xl",
                      msg.sender === 'staff'
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-gray-200 text-gray-800 rounded-tl-none"
                    )}
                  >
                    {msg.type === 'request' && (
                      <div className="mb-1 text-xs font-medium">
                        {msg.requestType} Request
                      </div>
                    )}
                    <div className="break-words">{msg.text}</div>
                    <div
                      className={cn(
                        "text-xs mt-1",
                        msg.sender === 'staff' ? "text-primary-light" : "text-gray-500"
                      )}
                    >
                      {formatMessageTime(msg.time)}
                      {msg.status && msg.sender === 'staff' && (
                        <span className="ml-2">{msg.status}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <Button
            size="icon"
            variant="outline"
            className="shrink-0"
            disabled={isSending}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[44px] flex-1 resize-none"
            disabled={isSending}
          />
          <Button
            size="icon"
            className="shrink-0"
            onClick={handleSendMessage}
            disabled={isSending || !message.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
