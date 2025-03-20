
import React from 'react';
import { useHotel } from '@/context/HotelContext';
import FeatureToggle from '@/components/FeatureToggle';

const HotelDining = () => {
  const { hotel } = useHotel();

  if (!hotel) return null;

  return (
    <FeatureToggle feature="dining">
      <div>
        <h1 className="text-2xl font-bold mb-6">Gestion de la restauration</h1>
        <p className="text-gray-500">Cette page est en cours de développement.</p>
      </div>
    </FeatureToggle>
  );
};

export default HotelDining;
