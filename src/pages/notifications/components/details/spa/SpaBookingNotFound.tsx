
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface SpaBookingNotFoundProps {
  onViewDetails: () => void;
  bookingId?: string;
}

export const SpaBookingNotFound: React.FC<SpaBookingNotFoundProps> = ({ onViewDetails, bookingId }) => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">Réservation introuvable</h3>
        <p className="text-gray-600 mb-4">
          Impossible de trouver les détails de cette réservation.
          {bookingId && <span className="block text-sm mt-1">ID: {bookingId}</span>}
        </p>
        <Button 
          onClick={onViewDetails} 
          className="mt-4"
        >
          Voir les détails complets
        </Button>
      </CardContent>
    </Card>
  );
};
