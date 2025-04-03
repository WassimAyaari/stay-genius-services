
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BookingErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const BookingErrorState: React.FC<BookingErrorStateProps> = ({ 
  message = "Une erreur s'est produite lors du chargement de la réservation.",
  onRetry 
}) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">Erreur</h3>
        <p className="text-gray-500 mb-4">
          {message}
        </p>
        <div className="flex justify-center gap-3">
          {onRetry && (
            <Button 
              variant="outline" 
              onClick={onRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Réessayer</span>
            </Button>
          )}
          <Button onClick={() => navigate('/spa')} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Retour aux services spa</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingErrorState;
