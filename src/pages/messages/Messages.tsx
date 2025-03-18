import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Bell, Briefcase, ArrowLeft, Send, Paperclip, Smile, Mic } from 'lucide-react';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'user' | 'staff';
  status?: 'sent' | 'delivered' | 'read';
}

interface Contact {
  id: string;
  name: string;
  role: string;
  icon: React.ReactNode;
  messages: Message[];
  isOnline: boolean;
  lastMessage?: string;
  avatar?: string;
}

const contacts: Contact[] = [
  {
    id: '1',
    name: 'Guest Relations',
    role: 'Available 24/7',
    icon: <Bell className="h-6 w-6 text-primary" />,
    isOnline: true,
    lastMessage: "I'll check the availability and get back to you shortly.",
    messages: [{
      id: '1',
      text: "Welcome to Hotel Genius! How may we assist you today?",
      time: '2:30 PM',
      sender: 'staff'
    }, {
      id: '2',
      text: "I'd like to request a late check-out tomorrow if possible.",
      time: '2:31 PM',
      sender: 'user'
    }, {
      id: '3',
      text: "I'll check the availability and get back to you shortly.",
      time: '2:32 PM',
      sender: 'staff'
    }]
  }, {
    id: '2',
    name: 'Concierge',
    role: 'Available 8AM-10PM',
    icon: <Briefcase className="h-6 w-6 text-primary" />,
    isOnline: true,
    lastMessage: "Yes, please. A table for two at 8 PM would be great.",
    messages: [{
      id: '1',
      text: "Would you like me to make dinner reservations for tonight?",
      time: '1:00 PM',
      sender: 'staff'
    }, {
      id: '2',
      text: "Yes, please. A table for two at 8 PM would be great.",
      time: '1:05 PM',
      sender: 'user'
    }]
  }
];

const Messages = () => {
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
  const [inputMessage, setInputMessage] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredContacts, setFilteredContacts] = React.useState<Contact[]>(contacts);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [selectedContact?.messages]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact => contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || contact.role.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredContacts(filtered);
    }
  }, [searchTerm]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && selectedContact) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        sender: 'user',
        status: 'sent'
      };

      console.log('Sending message:', newMessage);
      const updatedContact = {
        ...selectedContact,
        messages: [...selectedContact.messages, newMessage],
        lastMessage: inputMessage
      };

      setSelectedContact(updatedContact);

      const updatedContacts = filteredContacts.map(contact => contact.id === selectedContact.id ? updatedContact : contact);
      setFilteredContacts(updatedContacts);

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully."
      });
      setInputMessage('');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (selectedContact) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col h-screen w-screen">
        <div className="h-16 border-b bg-card flex items-center px-4 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setSelectedContact(null)} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {selectedContact.name.charAt(0)}
              </AvatarFallback>
              {selectedContact.avatar && <AvatarImage src={selectedContact.avatar} />}
            </Avatar>
            {selectedContact.isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />}
          </div>
          <div className="ml-3 flex-1">
            <h3 className="font-medium">{selectedContact.name}</h3>
            <p className="text-xs text-muted-foreground">{selectedContact.role}</p>
          </div>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-3 py-4">
            {selectedContact.messages.map(message => (
              <div 
                key={message.id} 
                className={cn(
                  "flex", 
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div 
                  className={cn(
                    "max-w-[80%] px-4 py-2 rounded-2xl mb-1", 
                    message.sender === 'user' 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-muted rounded-tl-none"
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                  <div 
                    className={cn(
                      "flex items-center justify-end gap-1 mt-1", 
                      message.sender === 'user' 
                        ? "text-primary-foreground/80" 
                        : "text-muted-foreground"
                    )}
                  >
                    <span className="text-[10px]">
                      {message.time}
                    </span>
                    {message.sender === 'user' && message.status && (
                      <span className="text-[10px] ml-1">
                        {message.status === 'read' && '✓✓'}
                        {message.status === 'delivered' && '✓✓'}
                        {message.status === 'sent' && '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t bg-card p-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 flex-shrink-0">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Textarea 
              value={inputMessage} 
              onChange={e => setInputMessage(e.target.value)} 
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }} 
              placeholder="Type a message" 
              className="resize-none min-h-0 h-10 py-2 px-4 rounded-full border-0 focus-visible:ring-1 bg-muted/50"
            />
            <Button 
              size="icon" 
              onClick={handleSendMessage} 
              className="rounded-full h-10 w-10 flex-shrink-0" 
              disabled={!inputMessage.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col h-screen w-screen">
      <div className="h-16 border-b bg-card flex items-center px-4 flex-shrink-0">
        <h1 className="text-xl font-semibold">Messages</h1>
      </div>
      
      <div className="px-4 py-3 border-b bg-card">
        <input 
          type="text" 
          placeholder="Search messages..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          className="w-full px-4 py-2 rounded-full bg-muted/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No contacts found</p>
            </div>
          ) : (
            filteredContacts.map(contact => (
              <div 
                key={contact.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors rounded-lg mb-1" 
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex items-center gap-3 p-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {contact.name.charAt(0)}
                      </AvatarFallback>
                      {contact.avatar && <AvatarImage src={contact.avatar} />}
                    </Avatar>
                    {contact.isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{contact.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {contact.messages.length > 0 ? formatTime(contact.messages[contact.messages.length - 1].time) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{contact.role}</p>
                    {contact.lastMessage && <p className="text-sm truncate mt-1">{contact.lastMessage}</p>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Messages;
