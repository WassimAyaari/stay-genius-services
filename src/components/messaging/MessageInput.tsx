
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send, MessageSquare } from 'lucide-react';
import ChatTemplates from '@/components/admin/chat/ChatTemplates';
import { ChatTemplate } from '@/hooks/useChatTemplates';

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
  const [showTemplates, setShowTemplates] = useState(false);
  
  const handleTemplateSelect = (template: ChatTemplate) => {
    setInputMessage(template.message);
    setShowTemplates(false);
  };
  return (
    <div className="border-t bg-card p-3 flex-shrink-0 relative">
      <ChatTemplates 
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelectTemplate={handleTemplateSelect}
      />
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-10 w-10 flex-shrink-0"
          type="button"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-10 w-10 flex-shrink-0"
          onClick={() => setShowTemplates(!showTemplates)}
          type="button"
        >
          <MessageSquare className="h-5 w-5" />
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
          placeholder="Type a message or use quick templates..." 
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
