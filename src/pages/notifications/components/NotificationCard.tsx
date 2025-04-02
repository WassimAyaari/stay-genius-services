
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, ShowerHead, Utensils } from 'lucide-react';
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

  // Get icon based on notification type and service type
  function getNotificationIcon() {
    if (notification.type === 'reservation') {
      return <Utensils className="h-5 w-5 text-gray-600" />;
    } else if (notification.type === 'spa_booking') {
      return <ShowerHead className="h-5 w-5 text-gray-600" />;
    } else {
      return <ShowerHead className="h-5 w-5 text-gray-600" />;
    }
  }

  // Format time safely - handle invalid dates
  function formatTimeAgo(date: Date | null) {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return 'récemment';
    }
    
    try {
      return formatDistanceToNow(date, { addSuffix: true, locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'récemment';
    }
  }

  // Get the background color for the card based on status
  function getCardBackgroundColor(status: string) {
    switch (status) {
      case 'confirmed':
      case 'completed': return 'bg-green-50';
      case 'cancelled': return 'bg-red-50';
      case 'in_progress': return 'bg-blue-50';
      default: return 'bg-yellow-50';
    }
  }

  return (
    <Card className={`hover:shadow-md transition-shadow ${getCardBackgroundColor(notification.status)}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white">
                {notification.type === 'request' ? 
                  <span className="text-xl">🔔</span> : 
                notification.type === 'reservation' ? 
                  <span className="text-xl">🍽️</span> : 
                  <span className="text-xl">🧖</span>}
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium">{notification.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
              
              {notification.type === 'request' && notification.data.room_number && (
                <div className="mt-1 text-xs text-gray-500">
                  Chambre: {notification.data.room_number}
                </div>
              )}
              
              <div className="mt-2 text-xs text-gray-500">
                {formatTimeAgo(notification.time)}
              </div>
            </div>
          </div>
          
          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(notification.status)} ml-2 whitespace-nowrap`}>
            {getStatusText(notification.status)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
