
import React, { useState } from 'react';
import { VoiceMessageInput } from '@/components/voice/VoiceMessageInput';

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  onSendMessage: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  userInfo?: {
    name: string;
    email?: string;
    roomNumber?: string;
  };
}

export const MessageInput: React.FC<MessageInputProps> = ({
  inputMessage,
  setInputMessage,
  onSendMessage,
  inputRef,
  userInfo
}) => {
  return (
    <VoiceMessageInput
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      onSendMessage={onSendMessage}
      inputRef={inputRef}
      userInfo={userInfo}
    />
  );
};
