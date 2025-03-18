import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Bell, Briefcase, ArrowLeft, Send, Paperclip, Smile, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
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
    messages: [
      {
        id: '1',
        text: "Welcome to Hotel Genius! How may we assist you today?",
        time: '2:30 PM',
        sender: 'staff'
      },
      {
        id: '2',
        text: "I'd like to request a late check-out tomorrow if possible.",
        time: '2:31 PM',
        sender: 'user'
      },
      {
        id: '3',
        text: "I'll check the availability and get back to you shortly.",
        time: '2:32 PM',
        sender: 'staff'
      }
    ]
  },
  {
    id: '2',
    name: 'Concierge',
    role: 'Available 8AM-10PM',
    icon: <Briefcase className="h-6 w-6 text-primary" />,
    isOnline: true,
    lastMessage: "Yes, please. A table for two at 8 PM would be great.",
    messages: [
      {
        id: '1',
        text: "Would you like me to make dinner reservations for tonight?",
        time: '1:00 PM',
        sender: 'staff'
      },
      {
        id: '2',
        text: "Yes, please. A table for two at 8 PM would be great.",
        time: '1:05 PM',
        sender: 'user'
      }
    ]
  }
];

const Messages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(contacts);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [contactsData, setContactsData] = useState<Contact[]>(contacts);

  const fromLocation = location.state?.from || '/';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const contactId = params.get('contact');
    
    if (contactId) {
      const contact = contactsData.find(c => c.id === contactId);
      if (contact) {
        setSelectedContact(contact);
      }
    }
  }, [location, contactsData]);

  useEffect(() => {
    if (selectedContact) {
      navigate(`/messages?contact=${selectedContact.id}`, { 
        replace: true,
        state: { from: location.state?.from || '/' }
      });
    } else {
      navigate('/messages', { replace: true });
    }
  }, [selectedContact, navigate, location.state?.from]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (selectedContact) {
      inputRef.current?.focus();
    }
  }, [selectedContact?.messages]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredContacts(contactsData);
    } else {
      const filtered = contactsData.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        contact.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchTerm, contactsData]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && selectedContact) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'user',
        status: 'sent'
      };

      const updatedContacts = contactsData.map(contact => {
        if (contact.id === selectedContact.id) {
          return {
            ...contact,
            messages: [...contact.messages, newMessage],
            lastMessage: inputMessage
          };
        }
        return contact;
      });

      setContactsData(updatedContacts);
      
      const updatedContact = updatedContacts.find(contact => contact.id === selectedContact.id);
      
      if (updatedContact) {
        setSelectedContact(updatedContact);
        setFilteredContacts(
          filteredContacts.map(contact => contact.id === selectedContact.id ? updatedContact : contact)
        );
      }
      
      setInputMessage('');
      
      setTimeout(() => {
        if (updatedContact) {
          const responseMessage: Message = {
            id: Date.now().toString(),
            text: "Thank you for your message. We'll get back to you shortly.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'staff'
          };
          
          const updatedContactsWithResponse = contactsData.map(contact => {
            if (contact.id === selectedContact.id) {
              return {
                ...contact,
                messages: [...contact.messages, responseMessage],
                lastMessage: responseMessage.text
              };
            }
            return contact;
          });
          
          setContactsData(updatedContactsWithResponse);
          
          const contactWithResponse = updatedContactsWithResponse.find(
            contact => contact.id === selectedContact.id
          );
          
          if (contactWithResponse) {
            setSelectedContact(contactWithResponse);
            setFilteredContacts(
              filteredContacts.map(contact => 
                contact.id === selectedContact.id ? contactWithResponse : contact
              )
            );
          }
        }
      }, 1000);
    }
  };

  const handleGoBack = () => {
    if (selectedContact) {
      setSelectedContact(null);
      navigate('/messages', { 
        replace: true,
        state: { from: fromLocation } 
      });
    } else {
      navigate('/', { replace: true });
    }
  };

  const formatTime = (timeString: string) => {
    if (!isNaN(Date.parse(timeString))) {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return timeString;
  };

  if (selectedContact) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col h-screen w-screen">
        <div className="h-16 border-b bg-card flex items-center px-4 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGoBack} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {selectedContact.name.charAt(0)}
              </AvatarFallback>
              {selectedContact.avatar && <AvatarImage src={selectedContact.avatar} />}
            </Avatar>
            {selectedContact.isOnline && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
            )}
          </div>
          <div className="ml-3 flex-1">
            <h3 className="font-medium">{selectedContact.name}</h3>
            <p className="text-xs text-muted-foreground">{selectedContact.role}</p>
          </div>
        </div>

        <ScrollArea className="flex-1 px-2 py-2">
          <div className="space-y-3">
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
                      {formatTime(message.time)}
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
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-10 w-10 flex-shrink-0"
              type="button"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            
            <Textarea 
              ref={inputRef}
              value={inputMessage} 
              onChange={(e) => setInputMessage(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message" 
              className="resize-none min-h-0 h-10 py-2 px-4 rounded-full border-0 focus-visible:ring-1 bg-muted/50" 
            />
            
            <Button 
              type="button"
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
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleGoBack} 
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Messages</h1>
      </div>
      
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
    </div>
  );
};

export default Messages;
