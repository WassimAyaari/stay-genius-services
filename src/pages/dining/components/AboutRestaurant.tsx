
import React from 'react';
import { Restaurant } from '@/features/dining/types';

interface AboutRestaurantProps {
  restaurant: Restaurant;
}

const AboutRestaurant = ({ restaurant }: AboutRestaurantProps) => {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-semibold mb-4">À propos de {restaurant.name}</h2>
      <p className="text-gray-700">{restaurant.description}</p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">Heures d'ouverture</h3>
      <p className="text-gray-700">{restaurant.openHours}</p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">Emplacement</h3>
      <p className="text-gray-700">{restaurant.location}</p>
    </div>
  );
};

export default AboutRestaurant;
