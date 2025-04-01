
import React from 'react';

interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'user' | 'staff';
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${message.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted rounded-tl-none'}`}>
        <p>{message.text}</p>
        <div className="flex justify-end items-center gap-1 mt-1 text-xs opacity-70">
          <span>{message.time}</span>
          {message.status === 'read' && <span>✓✓</span>}
          {message.status === 'delivered' && <span>✓✓</span>}
          {message.status === 'sent' && <span>✓</span>}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
