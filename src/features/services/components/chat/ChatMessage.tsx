
import React from 'react';
import { ClockIcon, CheckIcon, CheckCheckIcon } from 'lucide-react';

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

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // Format request messages differently
  const isRequestMessage = message.type === 'request';
  
  const getStatusIcon = () => {
    if (message.status === 'read') return <CheckCheckIcon className="h-3 w-3" />;
    if (message.status === 'delivered') return <CheckCheckIcon className="h-3 w-3" />;
    if (message.status === 'sent') return <CheckIcon className="h-3 w-3" />;
    return null;
  };
  
  const getRequestStatusBadge = () => {
    if (!isRequestMessage || !message.requestStatus) return null;
    
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    
    const statusText = {
      pending: 'En attente',
      in_progress: 'En cours',
      completed: 'Complété',
      cancelled: 'Annulé',
    };
    
    return (
      <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusColors[message.requestStatus]}`}>
        {statusText[message.requestStatus]}
      </span>
    );
  };

  return (
    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${message.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted rounded-tl-none'}`}>
        {isRequestMessage && message.requestType && (
          <div className="font-medium mb-1 text-sm">
            {message.requestType.charAt(0).toUpperCase() + message.requestType.slice(1)} {getRequestStatusBadge()}
          </div>
        )}
        <p>{message.text}</p>
        <div className="flex justify-end items-center gap-1 mt-1 text-xs opacity-70">
          <span>{message.time}</span>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
