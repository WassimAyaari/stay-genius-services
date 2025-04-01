
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { X } from 'lucide-react';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface ChatHeaderProps {
  userInfo: { name: string; roomNumber: string };
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ userInfo, onClose }) => {
  return (
    <SheetHeader className="h-16 border-b px-4 flex-shrink-0">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {userInfo.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <SheetTitle>Concierge Chat</SheetTitle>
            <p className="text-xs text-muted-foreground">Room: {userInfo.roomNumber}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
    </SheetHeader>
  );
};

export default ChatHeader;
