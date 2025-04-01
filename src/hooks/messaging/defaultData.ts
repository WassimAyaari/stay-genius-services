
import { Contact } from '@/types/messaging';

export const defaultContacts: Contact[] = [
  {
    id: '2',
    name: 'Concierge',
    role: 'Available 8AM-10PM',
    icon: null, // Will be set in the component
    isOnline: true,
    messages: [],
  }
];
