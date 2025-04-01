
import { ReactNode } from 'react';

export interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'user' | 'staff';
  status?: 'sent' | 'delivered' | 'read';
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  icon: ReactNode;
  messages: Message[];
  isOnline: boolean;
  lastMessage?: string;
  avatar?: string;
}
