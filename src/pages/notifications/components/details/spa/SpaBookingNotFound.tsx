
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SpaBookingNotFoundProps {
  onViewDetails?: () => void;
  bookingId?: string;
  errorMessage?: string;
}

export const SpaBookingNotFound: React.FC<SpaBookingNotFoundProps> = ({ 
  onViewDetails, 
  bookingId, 
  errorMessage 
}) => {
  const navigate = useNavigate();

  // Si onViewDetails n'est pas fourni, on redirige vers la liste des notifications
  const handleAction = () => {
    if (onViewDetails) {
      onViewDetails();
    } else {
      navigate('/notifications');
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">Réservation introuvable</h3>
        <p className="text-gray-600 mb-4">
          {errorMessage || "Impossible de trouver les détails de cette réservation."}
          {bookingId && <span className="block text-sm mt-1">ID: {bookingId}</span>}
        </p>
        <Button 
          onClick={handleAction} 
          className="mt-4"
        >
          {onViewDetails ? "Voir les détails complets" : "Retour aux notifications"}
        </Button>
      </CardContent>
    </Card>
  );
};
