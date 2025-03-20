
import React from 'react';
import { useHotel } from '@/context/HotelContext';

const HotelServices = () => {
  const { hotel } = useHotel();

  if (!hotel) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestion des services</h1>
      <p className="text-gray-500">Cette page est en cours de développement.</p>
    </div>
  );
};

export default HotelServices;
