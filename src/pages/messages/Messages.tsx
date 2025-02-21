
import React from 'react';
import { Card } from '@/components/ui/card';
import { MessageCircle, Phone, Bell, CoffeeIcon, Utensils, Briefcase, Mail } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  role: string;
  icon: React.ReactNode;
  lastMessage: string;
  time: string;
  unread: number;
}

const contacts: Contact[] = [
  {
    id: '1',
    name: 'Guest Relations',
    role: 'Available 24/7',
    icon: <Bell className="h-6 w-6 text-primary" />,
    lastMessage: "How may we assist you today?",
    time: '2m ago',
    unread: 1
  },
  {
    id: '2',
    name: 'Front Desk',
    role: 'Available 24/7',
    icon: <Phone className="h-6 w-6 text-primary" />,
    lastMessage: "Your room key is ready for pickup",
    time: '1h ago',
    unread: 0
  },
  {
    id: '3',
    name: 'Concierge',
    role: 'Available 8AM-10PM',
    icon: <Briefcase className="h-6 w-6 text-primary" />,
    lastMessage: "Would you like me to make dinner reservations?",
    time: '3h ago',
    unread: 1
  },
  {
    id: '4',
    name: 'Room Service',
    role: 'Available 24/7',
    icon: <Utensils className="h-6 w-6 text-primary" />,
    lastMessage: "Your order will arrive in 15 minutes",
    time: '5h ago',
    unread: 0
  },
  {
    id: '5',
    name: 'Housekeeping',
    role: 'Available 7AM-9PM',
    icon: <CoffeeIcon className="h-6 w-6 text-primary" />,
    lastMessage: "Your room has been serviced",
    time: 'Yesterday',
    unread: 0
  },
];

const Messages = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Messages</h1>
        <button className="text-primary">
          <Mail className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-3">
        {contacts.map((contact) => (
          <Card key={contact.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                {contact.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold truncate">{contact.name}</p>
                  <span className="text-sm text-muted-foreground flex-shrink-0">{contact.time}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground truncate">{contact.role}</p>
                  {contact.unread > 0 && (
                    <span className="h-5 w-5 rounded-full bg-primary text-[11px] text-white flex items-center justify-center flex-shrink-0 font-medium">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1 truncate">{contact.lastMessage}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Messages;
