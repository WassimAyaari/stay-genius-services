
import { Contact } from '@/types/messaging';
import guestServicesAvatar from '@/assets/guest-services-avatar.jpg';

export const defaultContacts: Contact[] = [
  {
    id: '2',
    name: 'Guest Services',
    role: '24/7 Hotel Assistance',
    icon: null, // Will be set in the component
    avatar: guestServicesAvatar,
    isOnline: true,
    messages: [],
  }
];
