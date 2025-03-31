
import React from 'react';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Clock, MapPin, Calendar } from 'lucide-react';
import { Restaurant } from '@/features/dining/types';

interface RestaurantInfoProps {
  restaurant: Restaurant;
  onBookingClick: () => void;
}

const RestaurantInfo = ({ restaurant, onBookingClick }: RestaurantInfoProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{restaurant.name}</h1>
        <p className="text-gray-600 mt-2">{restaurant.description}</p>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-600">
          <UtensilsCrossed className="w-5 h-5" />
          <span>{restaurant.cuisine}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-5 h-5" />
          <span>{restaurant.openHours}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-5 h-5" />
          <span>{restaurant.location}</span>
        </div>
      </div>
      
      <Button 
        className="w-full md:w-auto"
        onClick={onBookingClick}
        disabled={restaurant.status !== 'open'}
      >
        <Calendar className="mr-2 h-5 w-5" />
        {restaurant.actionText || "Book a Table"}
      </Button>
    </div>
  );
};

export default RestaurantInfo;
