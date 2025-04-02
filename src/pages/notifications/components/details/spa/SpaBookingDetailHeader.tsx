
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface SpaBookingDetailHeaderProps {
  status: string;
}

export const SpaBookingDetailHeader: React.FC<SpaBookingDetailHeaderProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'completed': return 'Complétée';
      case 'cancelled': return 'Annulée';
      case 'in_progress': return 'En cours';
      default: return 'En attente';
    }
  };

  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>Détails de la réservation</CardTitle>
        <Badge className={getStatusColor(status)}>
          {getStatusText(status)}
        </Badge>
      </div>
    </CardHeader>
  );
};
