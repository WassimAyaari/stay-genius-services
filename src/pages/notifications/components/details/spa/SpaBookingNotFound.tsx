
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SpaBookingNotFoundProps {
  onViewDetails: () => void;
}

export const SpaBookingNotFound: React.FC<SpaBookingNotFoundProps> = ({ onViewDetails }) => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <p className="text-lg font-medium text-gray-600">
          Impossible de trouver les détails de cette réservation.
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
