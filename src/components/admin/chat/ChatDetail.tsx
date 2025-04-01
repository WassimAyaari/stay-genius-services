
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Send, Trash2 } from 'lucide-react';
import { formatTimeAgo } from '@/utils/dateUtils';
import { Chat } from './types';
import { Badge } from '@/components/ui/badge';

interface ChatDetailProps {
  activeChat: Chat;
  replyMessage: string;
  setReplyMessage: (value: string) => void;
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
  onDeleteClick 
}: ChatDetailProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    textareaRef.current?.focus();
  }, [activeChat.messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendReply();
    }
  };

  // Get full name from userInfo if available
  const guestFullName = activeChat.userInfo?.firstName || activeChat.userInfo?.lastName 
    ? `${activeChat.userInfo?.firstName || ''} ${activeChat.userInfo?.lastName || ''}`.trim()
    : activeChat.userName;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToList}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => onDeleteClick(activeChat, e)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete Conversation
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Avatar className="h-14 w-14">
          <AvatarFallback>
            {guestFullName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {guestFullName}
            {activeChat.userInfo?.firstName && activeChat.userInfo?.lastName && (
              <Badge variant="outline" className="text-xs font-normal">Guest</Badge>
            )}
          </h2>
          <div className="text-sm text-muted-foreground space-y-0.5">
            {activeChat.roomNumber && <p>Room: {activeChat.roomNumber}</p>}
            <p>Last activity: {formatTimeAgo(new Date(activeChat.lastActivity))}</p>
            
            {/* Display guest full name if available */}
            {activeChat.userInfo?.firstName && activeChat.userInfo?.lastName && (
              <p className="font-medium text-primary">
                Guest: {activeChat.userInfo.firstName} {activeChat.userInfo.lastName}
              </p>
            )}
            
            {/* Only show username if it's different from the guest full name */}
            {activeChat.userName !== guestFullName && (
              <p>Username: {activeChat.userName}</p>
            )}
          </div>
        </div>
      </div>

      <div className="border rounded-md bg-card p-4 mb-6 h-[400px] overflow-y-auto">
        {activeChat.messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {activeChat.messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-muted rounded-tl-none'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <div className="flex justify-end items-center mt-1 text-xs opacity-70">
                    <span>{message.time}</span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your reply..."
          className="flex-1 resize-none min-h-[100px]"
        />
        <Button 
          onClick={onSendReply} 
          className="h-auto"
          disabled={!replyMessage.trim()}
        >
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatDetail;
