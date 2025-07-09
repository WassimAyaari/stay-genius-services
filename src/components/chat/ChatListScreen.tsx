import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';

interface ChatListScreenProps {
  onSelectChat: (type: 'concierge' | 'safety_ai') => void;
  userInfo: {
    name: string;
    email?: string;
    roomNumber?: string;
  };
}

export const ChatListScreen: React.FC<ChatListScreenProps> = ({
  onSelectChat,
  userInfo
}) => {
  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-background px-4 py-4">
        <h1 className="text-xl font-semibold">Chats</h1>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {/* Hotel Team Chat */}
        <div 
          className="flex items-center p-4 hover:bg-accent/50 cursor-pointer border-b border-border/40"
          onClick={() => onSelectChat('concierge')}
        >
          <div className="relative mr-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground truncate">Hotel Team</h3>
              <span className="text-xs text-muted-foreground">now</span>
            </div>
            <p className="text-sm text-muted-foreground truncate mt-1">
              Connect directly with our staff
            </p>
          </div>
        </div>

        {/* AI Assistant Chat */}
        <div 
          className="flex items-center p-4 hover:bg-accent/50 cursor-pointer border-b border-border/40"
          onClick={() => onSelectChat('safety_ai')}
        >
          <div className="relative mr-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-secondary/10">
                <Bot className="h-6 w-6 text-secondary" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-background"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground truncate">AI Assistant</h3>
              <span className="text-xs text-muted-foreground">now</span>
            </div>
            <p className="text-sm text-muted-foreground truncate mt-1">
              Instant AI help, can escalate to staff
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};