
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Send, Trash2, Check, X, Clock, FileText } from 'lucide-react';
import { formatTimeAgo } from '@/utils/dateUtils';
import { Chat, Message } from './types';
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

  const getRequestStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'in_progress':
        return <Clock className="h-3 w-3 text-blue-500" />;
      case 'completed':
        return <Check className="h-3 w-3 text-green-500" />;
      case 'cancelled':
        return <X className="h-3 w-3 text-red-500" />;
      default:
        return <Clock className="h-3 w-3 text-yellow-500" />;
    }
  };

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center text-xs"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="flex items-center text-xs"><Clock className="mr-1 h-3 w-3" /> In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 flex items-center text-xs"><Check className="mr-1 h-3 w-3" /> Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="flex items-center text-xs"><X className="mr-1 h-3 w-3" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

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
          <AvatarFallback className={activeChat.type === 'request' ? "bg-amber-100 text-amber-800" : ""}>
            {activeChat.type === 'request' ? <FileText className="h-6 w-6" /> : activeChat.userName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {activeChat.userInfo?.firstName && activeChat.userInfo?.lastName 
              ? `${activeChat.userInfo.firstName} ${activeChat.userInfo.lastName}` 
              : activeChat.userName}
            {activeChat.type === 'request' && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                Service Requests
              </Badge>
            )}
          </h2>
          <div className="text-sm text-muted-foreground space-y-0.5">
            {activeChat.roomNumber && <p>Room: {activeChat.roomNumber}</p>}
            <p>Last activity: {formatTimeAgo(new Date())}</p>
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
            {activeChat.messages.map((message: Message) => {
              const isRequest = message.type === 'request';
              return (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    isRequest 
                      ? 'bg-amber-50 border border-amber-200 text-amber-800 rounded-tr-none' 
                      : message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted rounded-tl-none'
                  }`}>
                    {isRequest && (
                      <div className="flex items-center gap-2 mb-1 text-xs font-medium">
                        <FileText className="h-3 w-3" />
                        <span className="capitalize">Service Request</span>
                        {message.requestStatus && getRequestStatusBadge(message.requestStatus)}
                      </div>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <div className="flex justify-end items-center mt-1 text-xs opacity-70">
                      <span>{message.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
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
