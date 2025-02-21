
import React from 'react';
import { Card } from '@/components/ui/card';
import { Bell, Briefcase } from 'lucide-react';
import Layout from '@/components/Layout';

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
    name: 'Concierge',
    role: 'Available 8AM-10PM',
    icon: <Briefcase className="h-6 w-6 text-primary" />,
    lastMessage: "Would you like me to make dinner reservations?",
    time: '3h ago',
    unread: 1
  },
];

const Messages = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b">
            <h1 className="text-2xl font-semibold">Messages</h1>
          </div>

          <div className="space-y-4">
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
                <p className="text-sm text-muted-foreground mt-2 truncate">{contact.lastMessage}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
