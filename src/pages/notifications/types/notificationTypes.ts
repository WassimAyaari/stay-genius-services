
import { ServiceRequest } from '@/features/rooms/types';
import { TableReservation } from '@/features/dining/types';

// Define a type for the combined notification items
export type NotificationItem = {
  id: string;
  type: 'request' | 'reservation';
  title: string;
  description: string;
  status: string;
  time: Date;
  link: string;
  data: {
    type?: string;
    room_number?: string;
    [key: string]: any;
  };
};

export type NotificationsState = {
  notifications: NotificationItem[];
  isLoading: boolean;
  isAuthenticated: boolean;
  userId?: string | null;
  userEmail?: string | null;
  userRoomNumber?: string | null;
};
