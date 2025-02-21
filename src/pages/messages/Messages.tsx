
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

  if (selectedContact) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto h-[calc(100vh-180px)] flex flex-col bg-[#f0f2f5]">
          {/* Chat Header */}
          <div className="p-3 bg-[#008069] text-white flex items-center gap-3 shadow-sm">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSelectedContact(null)}
              className="mr-2 hover:bg-[#ffffff1a]"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </Button>
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                {selectedContact.icon}
              </div>
              {selectedContact.isOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-[#008069]" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-white">{selectedContact.name}</h3>
              <p className="text-xs text-white/80">{selectedContact.role}</p>
            </div>
          </div>

          {/* Messages */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-2"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23e5e5e5' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E\")",
              backgroundRepeat: 'repeat',
              backgroundColor: '#efeae2'
            }}
          >
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
                    "max-w-[80%] px-3 py-2 rounded-lg relative shadow-sm",
                    message.sender === 'user'
                      ? "bg-[#d9fdd3] rounded-tr-none"
                      : "bg-white rounded-tl-none"
                  )}
                >
                  <p className="text-[0.9375rem] text-[#111b21]">{message.text}</p>
                  <p className="text-[0.6875rem] text-[#667781] text-right mt-1">
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-3 bg-[#f0f2f5]">
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-1 py-2 bg-transparent text-sm focus:outline-none"
              />
              <Button 
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (inputMessage.trim()) {
                    // Here we would normally add the message to the chat
                    // and send it to the backend
                    setInputMessage('');
                  }
                }}
                className="text-[#008069] hover:bg-[#008069]/10"
              >
                <Send className="h-5 w-5" />
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
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Messages</h1>
          </div>
          
          {contacts.map((contact) => (
            <Card 
              key={contact.id}
              className="cursor-pointer hover:bg-gray-50 transition-colors border-0 shadow-none"
              onClick={() => setSelectedContact(contact)}
            >
              <div className="flex items-center gap-4 p-3">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-[#008069]/10 flex items-center justify-center">
                    {contact.icon}
                  </div>
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0 border-b pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-[#111b21]">{contact.name}</h3>
                    <span className="text-xs text-[#667781]">2m ago</span>
                  </div>
                  <p className="text-sm text-[#667781]">{contact.role}</p>
                  {contact.lastMessage && (
                    <p className="text-sm text-[#667781] truncate mt-1">{contact.lastMessage}</p>
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
