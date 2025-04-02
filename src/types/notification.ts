
export interface NotificationItem {
  id: string;
  type: 'request' | 'reservation' | 'spa_booking';
  title: string;
  description: string;
  icon: string;
  status: string;
  time: Date;
  link: string;
  data?: {
    room_number?: string;
    date?: string;
    time?: string;
    guests?: number;
    service_type?: string;
    [key: string]: any;
  };
}
