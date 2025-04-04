
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils } from 'lucide-react';

interface ReservationDetailHeaderProps {
  status: string;
}

export const ReservationDetailHeader: React.FC<ReservationDetailHeaderProps> = ({ status }) => {
  // Get status information
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return "Confirmée";
      case 'cancelled': return "Annulée";
      case 'completed': return "Complétée";
      case 'in_progress': return "En cours";
      default: return "En attente";
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed': return "bg-green-100 text-green-800";
      case 'cancelled': return "bg-red-100 text-red-800";
      case 'in_progress': return "bg-blue-100 text-blue-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-full">
            <Utensils className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle>Réservation Restaurant</CardTitle>
        </div>
        <Badge className={getStatusClass(status)}>{getStatusText(status)}</Badge>
      </div>
    </CardHeader>
  );
};
