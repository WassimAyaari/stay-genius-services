
import React from 'react';
import { NotificationCard } from './NotificationCard';
import { NotificationItem } from '../hooks/useNotificationsData';

interface NotificationsListProps {
  notifications: NotificationItem[];
}

export const NotificationsList: React.FC<NotificationsListProps> = ({ notifications }) => {
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationCard 
          key={`${notification.type}-${notification.id}`}
          notification={notification}
        />
      ))}
    </div>
  );
};
