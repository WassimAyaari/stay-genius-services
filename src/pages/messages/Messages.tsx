
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Bell, Briefcase, ArrowLeft, Send, Paperclip, Smile, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

const defaultContacts: Contact[] = [
  {
    id: '2',
    name: 'Concierge',
    role: 'Available 8AM-10PM',
    icon: <Briefcase className="h-6 w-6 text-primary" />,
    isOnline: true,
    messages: [],
  }
];

const Messages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(defaultContacts);
  const [contactsData, setContactsData] = useState<Contact[]>(defaultContacts);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fromLocation = location.state?.from || '/';
  const [isLoading, setIsLoading] = useState(true);

  // Fetch messages from Supabase
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          setIsLoading(false);
          return;
        }

        const { data: messagesData, error } = await supabase
          .from('chat_messages')
          .select('*')
          .or(`user_id.eq.${userId},recipient_id.eq.${userId}`)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          toast({
            title: 'Error',
            description: 'Failed to load messages. Please try again.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        // Initialize with default contacts
        const updatedContacts = [...defaultContacts];
        
        if (messagesData && messagesData.length > 0) {
          // Extract and format all messages for the Concierge contact (id: '2')
          const conciergeMessages: Message[] = messagesData.map(msg => ({
            id: msg.id,
            text: msg.text,
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: msg.sender as 'user' | 'staff',
            status: msg.status as 'sent' | 'delivered' | 'read' | undefined
          }));
          
          // Update the Concierge contact with messages
          updatedContacts[0].messages = conciergeMessages;
          
          // Set last message if there are messages
          if (conciergeMessages.length > 0) {
            updatedContacts[0].lastMessage = conciergeMessages[conciergeMessages.length - 1].text;
          }
        }
        
        setContactsData(updatedContacts);
        setFilteredContacts(updatedContacts);
      } catch (err) {
        console.error('Error in message fetching:', err);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [toast]);

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

  const handleSendMessage = async () => {
    if (inputMessage.trim() && selectedContact) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'user',
        status: 'sent'
      };

      // Update UI first for responsiveness
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
      setSelectedContact(updatedContacts.find(c => c.id === selectedContact.id) || null);
      setFilteredContacts(
        filteredContacts.map(contact => contact.id === selectedContact.id ? updatedContacts.find(c => c.id === selectedContact.id)! : contact)
      );
      
      setInputMessage('');
      
      // Get user info
      const userDataString = localStorage.getItem('user_data');
      const userId = localStorage.getItem('user_id');
      let userName = 'Guest';
      let roomNumber = '';
      
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          userName = userData.name || 'Guest';
          roomNumber = userData.roomNumber || '';
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }

      // Save to Supabase
      try {
        const { error } = await supabase
          .from('chat_messages')
          .insert([{
            user_id: userId,
            recipient_id: null,
            user_name: userName,
            room_number: roomNumber,
            text: inputMessage,
            sender: 'user',
            status: 'sent',
            created_at: new Date().toISOString()
          }]);

        if (error) {
          console.error("Error saving message:", error);
          toast({
            title: "Error",
            description: "Failed to send your message. Please try again.",
            variant: "destructive"
          });
          return;
        }

        // Simulate response after a short delay
        setTimeout(async () => {
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
                messages: [...contact.messages, newMessage, responseMessage],
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
          
          // Save response to Supabase
          await supabase
            .from('chat_messages')
            .insert([{
              user_id: userId,
              recipient_id: userId,
              user_name: selectedContact.name,
              room_number: roomNumber,
              text: responseMessage.text,
              sender: 'staff',
              status: 'sent',
              created_at: new Date().toISOString()
            }]);
        }, 1000);
      } catch (error) {
        console.error("Error in handleSendMessage:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      }
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
      navigate(fromLocation || '/', { replace: true });
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
            {selectedContact.messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              selectedContact.messages.map(message => (
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
              ))
            )}
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
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredContacts.length === 0 ? (
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
