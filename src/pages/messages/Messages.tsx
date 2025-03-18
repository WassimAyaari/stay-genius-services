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
const contacts: Contact[] = [{
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
}];
const Messages = () => {
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
  const [inputMessage, setInputMessage] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredContacts, setFilteredContacts] = React.useState<Contact[]>(contacts);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const {
    toast
  } = useToast();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
  React.useEffect(() => {
    scrollToBottom();
  }, [selectedContact?.messages]);

  // Update filtered contacts when search term changes
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

      // Here we would integrate with a real chat service
      console.log('Sending message:', newMessage);
      const updatedContact = {
        ...selectedContact,
        messages: [...selectedContact.messages, newMessage],
        lastMessage: inputMessage
      };

      // Update the selected contact
      setSelectedContact(updatedContact);

      // Update the contact in the contacts list
      const updatedContacts = filteredContacts.map(contact => contact.id === selectedContact.id ? updatedContact : contact);
      setFilteredContacts(updatedContacts);

      // Show toast notification
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
    return <div className="fixed inset-0 bg-background flex flex-col h-screen">
        {/* Chat Header */}
        <div className="h-16 border-b bg-card flex items-center px-6 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setSelectedContact(null)} className="mr-3">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              {selectedContact.icon}
            </div>
            {selectedContact.isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />}
          </div>
          <div className="ml-4 flex-1">
            <h3 className="font-medium">{selectedContact.name}</h3>
            <p className="text-xs text-muted-foreground">{selectedContact.role}</p>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-5 mb-4">
            {selectedContact.messages.map(message => <div key={message.id} className={cn("flex", message.sender === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[80%] px-5 py-3 rounded-2xl", message.sender === 'user' ? "bg-primary text-primary-foreground" : "bg-muted")}>
                  <p className="text-sm">{message.text}</p>
                  <div className={cn("flex items-center justify-end gap-1 mt-2", message.sender === 'user' ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    <span className="text-[10px]">
                      {message.time}
                    </span>
                    {message.sender === 'user' && message.status && <span className="text-[8px]">
                        {message.status === 'read' && '✓✓'}
                        {message.status === 'delivered' && '✓✓'}
                        {message.status === 'sent' && '✓'}
                      </span>}
                  </div>
                </div>
              </div>)}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t bg-card p-4 flex-shrink-0">
          <div className="flex flex-col gap-3 h-full max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" title="Attach file">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" title="Voice message">
                <Mic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" title="Emoji">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Textarea value={inputMessage} onChange={e => setInputMessage(e.target.value)} onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }} placeholder="Type a message" className="flex-1 resize-none min-h-0 h-12 py-3 px-4 rounded-2xl" />
              <Button size="icon" onClick={handleSendMessage} className="rounded-full h-12 w-12 flex items-center justify-center" disabled={!inputMessage.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>;
  }
  return <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 min-h-[calc(100vh-16rem)]">
        <div className="space-y-4 my-6">
          <div className="flex items-center justify-between mb-6">
            
          </div>
          
          <div className="relative mb-6">
            <input type="text" placeholder="Search messages..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          
          {filteredContacts.length === 0 ? <div className="text-center py-8">
              <p className="text-muted-foreground">No contacts found</p>
            </div> : filteredContacts.map(contact => <Card key={contact.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelectedContact(contact)}>
                <div className="flex items-center gap-4 p-5">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {contact.icon}
                    </div>
                    {contact.isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{contact.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {contact.messages.length > 0 ? formatTime(contact.messages[contact.messages.length - 1].time) : ''}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{contact.role}</p>
                    {contact.lastMessage && <p className="text-sm truncate mt-1">{contact.lastMessage}</p>}
                  </div>
                </div>
              </Card>)}
        </div>
      </div>
    </Layout>;
};
export default Messages;