
import React from 'react';
import { StatusIcon } from './NotificationIcon';

interface NotificationStatusLabelProps {
  status: string;
  type: string;
}

export const NotificationStatusLabel: React.FC<NotificationStatusLabelProps> = ({ 
  status, 
  type 
}) => {
  const getStatusText = (status: string, type: string) => {
    if (type === 'reservation' || type === 'spa_booking') {
      switch (status) {
        case 'confirmed': return 'Confirmée';
        case 'cancelled': return 'Annulée';
        case 'pending': return 'En attente';
        case 'in_progress': return 'En cours';
        case 'completed': return 'Complétée';
        default: return 'En attente';
      }
    } else {
      switch (status) {
        case 'completed': return 'Complétée';
        case 'in_progress': return 'En cours';
        case 'cancelled': return 'Annulée';
        case 'pending': return 'En attente';
        default: return 'En attente';
      }
    }
  };

  return (
    <div className="flex items-center gap-1">
      <StatusIcon status={status} />
      <span className="text-sm font-medium">
        {getStatusText(status, type)}
      </span>
    </div>
  );
};
