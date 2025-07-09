import React from 'react';
import { UnifiedChatHeader } from './UnifiedChatHeader';
import { UnifiedMessagesList } from './UnifiedMessagesList';
import { UnifiedChatInput } from './UnifiedChatInput';
import { useUnifiedChat } from '@/hooks/useUnifiedChat';

interface UnifiedChatContainerProps {
  userInfo: {
    name: string;
    email?: string;
    roomNumber?: string;
  };
  isAdmin?: boolean;
  className?: string;
}

export const UnifiedChatContainer: React.FC<UnifiedChatContainerProps> = ({
  userInfo,
  isAdmin = false,
  className = ""
}) => {
  const {
    conversation,
    messages,
    isLoading,
    isTyping,
    currentHandler,
    inputMessage,
    setInputMessage,
    sendMessage,
    escalateToHuman,
    takeOverConversation,
    messagesEndRef,
    inputRef
  } = useUnifiedChat({ userInfo, isAdmin });

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-full bg-background ${className}`}>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      <UnifiedChatHeader 
        conversation={conversation}
        currentHandler={currentHandler as 'ai' | 'human'}
        isAdmin={isAdmin}
        onEscalateToHuman={escalateToHuman}
        onTakeOver={takeOverConversation}
      />
      
      <UnifiedMessagesList 
        messages={messages}
        isTyping={isTyping}
        messagesEndRef={messagesEndRef}
        currentUser={userInfo}
        isAdmin={isAdmin}
      />
      
      <UnifiedChatInput 
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        onSendMessage={sendMessage}
        inputRef={inputRef}
        currentHandler={currentHandler as 'ai' | 'human'}
        isTyping={isTyping}
      />
    </div>
  );
};