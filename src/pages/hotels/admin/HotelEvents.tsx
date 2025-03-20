
import React from 'react';
import { useHotel } from '@/context/HotelContext';
import FeatureToggle from '@/components/FeatureToggle';

const HotelEvents = () => {
  const { hotel } = useHotel();

  if (!hotel) return null;

  return (
    <FeatureToggle feature="events">
      <div>
        <h1 className="text-2xl font-bold mb-6">Gestion des événements</h1>
        <p className="text-gray-500">Cette page est en cours de développement.</p>
      </div>
    </FeatureToggle>
  );
};

export default HotelEvents;
