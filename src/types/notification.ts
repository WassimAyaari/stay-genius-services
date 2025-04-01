
export interface NotificationItem {
  id: string;
  type: 'request' | 'reservation';
  title: string;
  description: string;
  icon: string;
  status: string;
  time: Date;
  link: string;
}
