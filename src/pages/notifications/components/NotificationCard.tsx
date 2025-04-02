
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import type { NotificationItem } from '../types/notificationTypes';

interface NotificationCardProps {
  notification: NotificationItem;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  // Get color based on notification status
  function getStatusColor(status: string) {
    switch (status) {
      case 'confirmed':
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Complétée';
      case 'cancelled': return 'Annulée';
      case 'confirmed': return 'Confirmée';
      default: return 'En attente';
    }
  }

  // Get status icon based on notification status
  function getStatusIcon(status: string) {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600 mr-1" />;
      default:
        return null;
    }
  }

  return (
    <Link to={notification.link}>
      <Card className={`hover:shadow-md transition-shadow border-l-4 ${getStatusColor(notification.status)}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                <span className="text-xl">{notification.type === 'request' ? '🔔' : '🍽️'}</span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-medium">{notification.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(notification.status)} flex items-center`}>
                  {getStatusIcon(notification.status)}
                  {getStatusText(notification.status)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600">{notification.description}</p>
              
              {notification.type === 'request' && notification.data.room_number && (
                <div className="mt-1 text-xs text-gray-500">
                  Chambre: {notification.data.room_number}
                </div>
              )}
              
              <div className="mt-2 text-xs text-gray-500">
                {formatDistanceToNow(notification.time, { addSuffix: true, locale: fr })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
