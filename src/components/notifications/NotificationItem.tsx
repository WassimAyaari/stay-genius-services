
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NotificationItemProps {
  id: string;
  type: 'request' | 'reservation';
  title: string;
  description: string;
  icon: string;
  status: string;
  time: Date;
  link: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  title,
  description,
  icon,
  status,
  time,
  link
}) => {
  // Get color based on notification status
  function getStatusColor(status: string) {
    switch (status) {
      case 'confirmed':
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Complétée';
      case 'cancelled': return 'Annulée';
      case 'confirmed': return 'Confirmée';
      default: return 'Inconnu';
    }
  }

  return (
    <Link to={link} key={id}>
      <div className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-200/70">
        <div className="flex-shrink-0 mt-1">
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200">
            <span className="text-lg">{icon}</span>
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">{title}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(status)}`}>
              {getStatusText(status)}
            </span>
          </div>
          <p className="text-xs text-gray-600">{description}</p>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(time, { addSuffix: true, locale: fr })}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default NotificationItem;
