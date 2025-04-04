
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface SpaBookingNotFoundProps {
  bookingId: string;
  errorMessage: string | null;
  onViewDetails: () => void;
}

export const SpaBookingNotFound: React.FC<SpaBookingNotFoundProps> = ({
  bookingId,
  errorMessage,
  onViewDetails
}) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6 flex flex-col items-center justify-center text-center p-8">
        <div className="rounded-full bg-yellow-100 p-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-600" />
        </div>
        
        <h2 className="text-xl font-semibold mb-2">Réservation introuvable</h2>
        
        <p className="text-muted-foreground mb-2">
          {errorMessage || `Nous n'avons pas pu trouver la réservation avec l'identifiant ${bookingId}.`}
        </p>
        
        <p className="text-sm text-gray-500 mb-6">
          La réservation peut avoir été annulée ou l'identifiant est incorrect.
        </p>
        
        <Button onClick={onViewDetails}>
          Retour aux notifications
        </Button>
      </CardContent>
    </Card>
  );
};
