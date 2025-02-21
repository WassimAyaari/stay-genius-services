
import React from 'react';
import { Card } from '@/components/ui/card';
import { Bell, Briefcase, ArrowLeft, Send } from 'lucide-react';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'user' | 'staff';
}

interface Contact {
  id: string;
  name: string;
  role: string;
  icon: React.ReactNode;
  messages: Message[];
  isOnline: boolean;
  lastMessage?: string;
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
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
  const [inputMessage, setInputMessage] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [selectedContact?.messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && selectedContact) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'user'
      };

      // Here we would integrate with a real chat service
      console.log('Sending message:', newMessage);
      
      setInputMessage('');
    }
  };

  if (selectedContact) {
    return (
      <div className="fixed inset-0 bg-background">
        {/* Chat Header */}
        <div className="h-16 border-b bg-card flex items-center px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSelectedContact(null)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              {selectedContact.icon}
            </div>
            {selectedContact.isOnline && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
            )}
          </div>
          <div className="ml-3">
            <h3 className="font-medium">{selectedContact.name}</h3>
            <p className="text-xs text-muted-foreground">{selectedContact.role}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[calc(100vh-128px)] overflow-y-auto p-4 space-y-4">
          {selectedContact.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] px-4 py-2 rounded-2xl",
                  message.sender === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.text}</p>
                <p className={cn(
                  "text-[10px] mt-1",
                  message.sender === 'user'
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                )}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="h-16 border-t bg-card p-3">
          <div className="flex items-center gap-2 h-full">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message"
              className="flex-1 bg-muted rounded-full px-4 py-2 text-sm focus:outline-none"
            />
            <Button 
              size="icon"
              onClick={handleSendMessage}
              className="rounded-full"
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
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Messages</h1>
          </div>
          
          {contacts.map((contact) => (
            <Card 
              key={contact.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setSelectedContact(contact)}
            >
              <div className="flex items-center gap-4 p-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {contact.icon}
                  </div>
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{contact.name}</h3>
                    <span className="text-xs text-muted-foreground">2m ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{contact.role}</p>
                  {contact.lastMessage && (
                    <p className="text-sm truncate mt-1">{contact.lastMessage}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
