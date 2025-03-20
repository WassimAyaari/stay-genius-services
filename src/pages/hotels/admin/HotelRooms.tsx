
import React from 'react';
import { useHotel } from '@/context/HotelContext';
import FeatureToggle from '@/components/FeatureToggle';

const HotelRooms = () => {
  const { hotel } = useHotel();

  if (!hotel) return null;

  return (
    <FeatureToggle feature="rooms">
      <div>
        <h1 className="text-2xl font-bold mb-6">Gestion des chambres</h1>
        <p className="text-gray-500">Cette page est en cours de développement.</p>
      </div>
    </FeatureToggle>
  );
};

export default HotelRooms;
