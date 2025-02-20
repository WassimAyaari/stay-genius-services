
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, UtensilsCrossed } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onBookTable: (restaurantId: string) => void;
}

const RestaurantCard = ({ restaurant, onBookTable }: RestaurantCardProps) => {
  return (
    <Card className="w-full snap-center animate-fade-in">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <img 
          src={restaurant.images[0]} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`
            px-2 py-1 rounded-full text-xs
            ${restaurant.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
          `}>
            {restaurant.status}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-secondary mb-2">{restaurant.name}</h3>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <UtensilsCrossed className="w-4 h-4" />
            {restaurant.cuisine}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            {restaurant.openHours}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            {restaurant.location}
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">{restaurant.description}</p>
        <Button 
          onClick={() => onBookTable(restaurant.id)}
          className="w-full bg-primary hover:bg-primary-dark"
        >
          Book a Table
        </Button>
      </div>
    </Card>
  );
};

export default RestaurantCard;
