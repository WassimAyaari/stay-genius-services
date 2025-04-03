
import React from 'react';
import { CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShowerHead } from 'lucide-react';

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
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="flex items-center">
        <div className="bg-indigo-100 p-2 rounded-full mr-3">
          <ShowerHead className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-medium">Réservation de spa</h2>
          <p className="text-sm text-gray-500">Service bien-être</p>
        </div>
      </div>
      <Badge className={getStatusColor(status)}>
        {getStatusText(status)}
      </Badge>
    </CardHeader>
  );
};
