import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User } from 'lucide-react';
import { VoiceMessageInput } from '@/components/voice/VoiceMessageInput';

interface UnifiedChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  currentHandler: 'ai' | 'human';
  isTyping: boolean;
  userInfo?: {
    name: string;
    email?: string;
    roomNumber?: string;
  };
}

export const UnifiedChatInput: React.FC<UnifiedChatInputProps> = ({
  inputMessage,
  setInputMessage,
  onSendMessage,
  inputRef,
  currentHandler,
  isTyping,
  userInfo
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const isAIHandling = currentHandler === 'ai';

  return (
    <div className="bg-card">
      <div className="flex items-center gap-2 p-3 pb-0">
        {isAIHandling ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Bot className="h-3 w-3" />
            <span>AI Assistant with voice support</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>Human staff available</span>
          </div>
        )}
      </div>
      
      {isAIHandling ? (
        <VoiceMessageInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={onSendMessage}
          inputRef={inputRef}
          userInfo={userInfo}
        />
      ) : (
        <div className="border-t bg-card p-3">
          <div className="flex space-x-2">
            <Textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message to staff..."
              className="flex-1 min-h-[40px] max-h-[120px] resize-none"
              disabled={isTyping}
            />
            <Button 
              onClick={onSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              size="icon"
              className="h-10 w-10 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};