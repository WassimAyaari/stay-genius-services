
export interface NotificationItem {
  id: string;
  type: 'request' | 'reservation' | 'spa_booking';
  title: string;
  description: string;
  icon: string;
  status: string;
  time: Date;
  link: string;
}
