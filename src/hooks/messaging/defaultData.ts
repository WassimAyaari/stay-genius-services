
import { Contact } from '@/types/messaging';

export const defaultContacts: Contact[] = [
  {
    id: '2',
    name: 'Guest Services',
    role: '24/7 Hotel Assistance',
    icon: null, // Will be set in the component
    isOnline: true,
    messages: [
      {
        id: 'welcome-1',
        text: 'Welcome to Hotel Genius! 🏨 I\'m here to assist you with any requests during your stay. Whether you need room service, housekeeping, restaurant reservations, or have any questions, I\'m happy to help!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'staff',
      }
    ],
  }
];
