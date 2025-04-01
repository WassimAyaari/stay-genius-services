
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Contact } from '@/types/messaging';

interface ContactListProps {
  contacts: Contact[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSelectContact: (contact: Contact) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  isLoading,
  searchTerm,
  setSearchTerm,
  onSelectContact
}) => {
  const formatTime = (timeString: string) => {
    if (!isNaN(Date.parse(timeString))) {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return timeString;
  };

  return (
    <>
      <div className="px-4 py-3 border-b bg-card">
        <input 
          type="text" 
          placeholder="Search messages..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full px-4 py-2 rounded-full bg-muted/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
        />
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No contacts found</p>
            </div>
          ) : (
            contacts.map(contact => (
              <div 
                key={contact.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors rounded-lg mb-1" 
                onClick={() => onSelectContact(contact)}
              >
                <div className="flex items-center gap-3 p-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {contact.name.charAt(0)}
                      </AvatarFallback>
                      {contact.avatar && <AvatarImage src={contact.avatar} />}
                    </Avatar>
                    {contact.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{contact.name}</h3>
                      <span className="text-xs text-muted-foreground py-0 my-0 mx-[23px] px-[5px]">
                        {contact.messages.length > 0 ? formatTime(contact.messages[contact.messages.length - 1].time) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{contact.role}</p>
                    {contact.lastMessage && (
                      <p className="text-sm truncate mt-1 my-[3px] py-0 px-0 text-left">
                        {contact.lastMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </>
  );
};
