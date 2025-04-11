
import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Chat } from './types';

interface MessageInputProps {
  chat: Chat;
  onSendMessage: (chat: Chat, message: string) => Promise<{success: boolean, userName?: string}>;
  isSending: boolean;
}

const MessageInput = ({ chat, onSendMessage, isSending }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  
  const handleSendMessage = async () => {
    if (!message.trim() || !chat) return;
    
    const result = await onSendMessage(chat, message);
    if (result.success) {
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
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
  );
};

export default MessageInput;
