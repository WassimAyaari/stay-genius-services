
import React from 'react';
import { NotificationCard } from './NotificationCard';
import type { NotificationItem } from '../types/notificationTypes';

interface NotificationsListProps {
  notifications: NotificationItem[];
}

export const NotificationsList: React.FC<NotificationsListProps> = ({ notifications }) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }
  
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
