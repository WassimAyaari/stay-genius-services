import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ShowerHead, Calendar, Utensils, FileText, Clock, Bell } from 'lucide-react';

interface NotificationItemProps {
  id: string;
  type: 'request' | 'reservation' | 'spa_booking' | 'general';
  title: string;
  description: string;
  icon: string;
  status: string;
  time: Date;
  link: string;
  data?: any;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  type,
  title,
  description,
  icon,
  status,
  time,
  link,
  data
}) => {
  // Get direct link based on notification type
  function getDirectLink() {
    switch (type) {
      case 'spa_booking': 
        return `/spa/booking/${id}`;
      case 'reservation': 
        return `/dining/reservations/${id}`;
      case 'request': 
        return `/requests/${id}`;
      default: 
        return link || '/notifications';
    }
  }

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

  function renderIcon() {
    if (type === 'spa_booking') {
      return <ShowerHead className="h-4 w-4 text-blue-600" />;
    } else if (type === 'reservation') {
      return <Utensils className="h-4 w-4 text-orange-600" />;
    } else if (type === 'request') {
      return <FileText className="h-4 w-4 text-purple-600" />;
    } else if (type === 'general') {
      return <Bell className="h-4 w-4 text-gray-600" />;
    }
    return <span className="text-lg">{icon}</span>;
  }

  function getSafeTimeAgo(date: Date) {
    try {
      return formatDistanceToNow(date, { addSuffix: true, locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'récemment';
    }
  }

  function getSummary() {
    if (type === 'spa_booking') {
      return `Réservation pour ${data?.date || ''} à ${data?.time || ''}`;
    } else if (type === 'reservation') {
      return `Réservation pour ${data?.guests || ''} personne(s) le ${data?.date || ''} à ${data?.time || ''}`;
    } else if (type === 'request') {
      return description || 'Demande de service';
    }
    return description;
  }

  function getActions() {
    const canCancel = ['pending', 'confirmed', 'in_progress'].includes(status);
    const canEdit = ['pending'].includes(status);
    
    if (!canCancel && !canEdit) return null;
    
    return (
      <div className="mt-1 text-xs">
        {canCancel && <span className="text-red-600 mr-2">Annuler</span>}
        {canEdit && <span className="text-blue-600">Modifier</span>}
      </div>
    );
  }

  return (
    <Link to={getDirectLink()} key={id}>
      <div className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-200/70">
        <div className="flex-shrink-0 mt-1">
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200">
            {renderIcon()}
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">{title}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(status)}`}>
              {getStatusText(status)}
            </span>
          </div>
          <p className="text-xs text-gray-800">{getSummary()}</p>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {getSafeTimeAgo(time)}
          </div>
          {getActions()}
        </div>
      </div>
    </Link>
  );
};

export default NotificationItem;
