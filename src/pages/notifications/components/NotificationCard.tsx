
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { ServiceRequest } from '@/features/rooms/types';
import { NotificationIcon } from './NotificationIcon';
import { NotificationStatusLabel } from './NotificationStatusLabel';
import { NotificationItem } from '../hooks/useNotificationsData';

interface NotificationCardProps {
  notification: NotificationItem;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  return (
    <Link to={notification.link} key={`${notification.type}-${notification.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4 flex items-start gap-4">
          <div className="p-3 bg-gray-100 rounded-full">
            <NotificationIcon 
              notificationType={notification.type} 
              serviceType={notification.type === 'request' 
                ? (notification.data as ServiceRequest).type 
                : undefined} 
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-medium text-lg">{notification.title}</h3>
              <NotificationStatusLabel 
                status={notification.status} 
                type={notification.type} 
              />
            </div>
            <p className="text-gray-600 mb-1">{notification.description}</p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(notification.time, { addSuffix: true, locale: fr })}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};
