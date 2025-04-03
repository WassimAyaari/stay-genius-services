
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, RefreshCw, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BookingNotFoundProps {
  onRetry?: () => void;
}

const BookingNotFound: React.FC<BookingNotFoundProps> = ({ onRetry }) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">Réservation introuvable</h3>
        <p className="text-gray-500 mb-4">
          La réservation que vous recherchez n'existe pas ou a été supprimée.
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
            <LayoutDashboard className="h-4 w-4" />
            <span>Voir tous les services</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingNotFound;
