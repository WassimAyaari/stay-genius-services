
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface SpaBookingNotFoundProps {
  onViewDetails: () => void;
  message?: string;
}

export const SpaBookingNotFound: React.FC<SpaBookingNotFoundProps> = ({ 
  onViewDetails,
  message = "Impossible de trouver les détails de cette réservation."
}) => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-600 mb-4">
          {message}
        </p>
        <Button 
          onClick={onViewDetails} 
          className="mt-2"
        >
          Voir les détails complets
        </Button>
      </CardContent>
    </Card>
  );
};
