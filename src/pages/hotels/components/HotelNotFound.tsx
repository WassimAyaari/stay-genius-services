
import React from 'react';
import { Button } from '@/components/ui/button';

const HotelNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Hôtel non trouvé</h1>
      <p className="text-lg text-gray-600 mb-6">
        L'hôtel que vous recherchez n'existe pas ou a été supprimé.
      </p>
      <Button asChild variant="default">
        <a href="/">Retourner à l'accueil</a>
      </Button>
    </div>
  );
};

export default HotelNotFound;
