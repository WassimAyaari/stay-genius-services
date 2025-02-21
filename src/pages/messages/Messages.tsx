
import React from 'react';
import { Card } from '@/components/ui/card';
import { Bell, Briefcase, ArrowLeft } from 'lucide-react';
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

  if (selectedContact) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto h-[calc(100vh-180px)] flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center gap-3">
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
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
              )}
            </div>
            <div>
              <h3 className="font-medium">{selectedContact.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedContact.role}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                    "max-w-[80%] rounded-2xl px-4 py-2",
                    message.sender === 'user'
                      ? "bg-primary text-white"
                      : "bg-gray-100"
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
          </div>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <Button 
                onClick={() => {
                  if (inputMessage.trim()) {
                    setInputMessage('');
                  }
                }}
                className="rounded-full"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold mb-6">Messages</h1>
          
          {contacts.map((contact) => (
            <Card 
              key={contact.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedContact(contact)}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {contact.icon}
                  </div>
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{contact.name}</h3>
                    <span className="text-sm text-muted-foreground">2m ago</span>
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
