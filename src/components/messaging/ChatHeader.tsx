
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Contact } from '@/types/messaging';

interface ChatHeaderProps {
  contact: Contact;
  onGoBack: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ contact, onGoBack }) => {
  return (
    <div className="h-16 border-b bg-card flex items-center px-4 flex-shrink-0">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onGoBack} 
        className="mr-2"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary">
            {contact.name.charAt(0)}
          </AvatarFallback>
          {contact.avatar && <AvatarImage src={contact.avatar} />}
        </Avatar>
        {contact.isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
        )}
      </div>
      <div className="ml-3 flex-1">
        <h3 className="font-medium">{contact.name}</h3>
        <p className="text-xs text-muted-foreground">{contact.role}</p>
      </div>
    </div>
  );
};
