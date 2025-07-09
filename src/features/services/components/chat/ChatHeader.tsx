
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, RotateCcw } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ChatHeaderProps {
  userInfo: { name: string; roomNumber: string };
  onClose: () => void;
  onReset?: () => void;
}

const ChatHeader = ({ userInfo, onClose, onReset }: ChatHeaderProps) => {
  return (
    <div className="h-16 border-b flex items-center px-4 justify-between bg-background">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 bg-sky-100">
          <AvatarFallback className="text-primary">
            {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'C'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">Concierge</h3>
          <p className="text-xs text-muted-foreground">
            {userInfo.roomNumber ? `Room ${userInfo.roomNumber}` : 'Available 8AM-10PM'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onReset && (
          <Button variant="ghost" size="icon" onClick={onReset} title="Reset Chat">
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
