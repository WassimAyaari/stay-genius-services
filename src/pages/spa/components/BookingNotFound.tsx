
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const BookingNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">Réservation introuvable</h3>
        <p className="text-gray-500 mb-4">
          La réservation que vous recherchez n'existe pas ou a été supprimée.
        </p>
        <Button onClick={() => navigate('/profile')}>
          Retour au profil
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookingNotFound;
