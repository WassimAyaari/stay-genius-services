
import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, ArrowLeft, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Chat, Message } from '@/components/admin/chat/types';

interface ChatDetailProps {
  activeChat: Chat;
  replyMessage: string;
  setReplyMessage: React.Dispatch<React.SetStateAction<string>>;
  onSendReply: () => void;
  onBackToList: () => void;
  onDeleteClick: (chat: Chat, e: React.MouseEvent) => void;
}

const ChatDetail = ({
  activeChat,
  replyMessage,
  setReplyMessage,
  onSendReply,
  onBackToList,
  onDeleteClick,
}: ChatDetailProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [activeChat.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex items-center gap-4 mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBackToList}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarFallback>
            {activeChat.userInfo?.firstName 
              ? activeChat.userInfo.firstName.charAt(0) 
              : activeChat.userName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-medium">
            {activeChat.userInfo?.firstName && activeChat.userInfo?.lastName 
              ? `${activeChat.userInfo.firstName} ${activeChat.userInfo.lastName}` 
              : activeChat.userName}
          </h2>
          <div className="flex items-center gap-2 text-xs">
            {activeChat.roomNumber && (
              <p className="font-medium text-primary">Room: {activeChat.roomNumber}</p>
            )}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={(e) => onDeleteClick(activeChat, e)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
      
      <Card className="flex-1 mb-4 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {activeChat.messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                userName={activeChat.userInfo?.firstName || activeChat.userName} 
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </Card>
      
      <div className="flex items-center gap-2">
        <Textarea 
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          placeholder={`Type your reply to ${activeChat.userInfo?.firstName || activeChat.userName}...`}
          className="resize-none min-h-[60px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSendReply();
            }
          }}
        />
        <Button 
          onClick={onSendReply}
          disabled={!replyMessage.trim()}
          className="self-end h-10"
        >
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
  userName: string;
}

const MessageBubble = ({ message, userName }: MessageBubbleProps) => {
  return (
    <div 
      className={cn(
        "flex", 
        message.sender === 'staff' ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "max-w-[80%] px-4 py-2 rounded-2xl", 
          message.sender === 'staff' 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted rounded-tl-none"
        )}
      >
        {message.sender === 'user' && (
          <div className="text-xs font-medium mb-1 text-muted-foreground">
            {userName}
          </div>
        )}
        <p className="text-sm">{message.text}</p>
        <div className="flex justify-end items-center gap-1 mt-1 text-xs opacity-70">
          <span>{message.time}</span>
          {message.sender === 'staff' && message.status && (
            <span>
              {message.status === 'read' && '✓✓'}
              {message.status === 'delivered' && '✓✓'}
              {message.status === 'sent' && '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
