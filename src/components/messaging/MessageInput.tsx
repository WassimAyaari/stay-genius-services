
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send, Smile } from 'lucide-react';

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  onSendMessage: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  inputMessage,
  setInputMessage,
  onSendMessage,
  inputRef
}) => {
  return (
    <div className="border-t bg-card p-3 flex-shrink-0">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-10 w-10 flex-shrink-0"
          type="button"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <Textarea 
          ref={inputRef}
          value={inputMessage} 
          onChange={(e) => setInputMessage(e.target.value)} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSendMessage();
            }
          }}
          placeholder="Type a message" 
          className="resize-none min-h-0 h-10 py-2 px-4 rounded-full border-0 focus-visible:ring-1 bg-muted/50" 
        />
        
        <Button 
          type="button"
          size="icon" 
          onClick={onSendMessage} 
          className="rounded-full h-10 w-10 flex-shrink-0" 
          disabled={!inputMessage.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
