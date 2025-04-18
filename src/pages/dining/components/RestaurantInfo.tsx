
import React from 'react';
import { Button } from '@/components/ui/button';
import { Restaurant } from '@/features/dining/types';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface RestaurantInfoProps {
  restaurant: Restaurant;
  onBookingClick: () => void;
  onViewMenuClick?: () => void;  // New prop for viewing menu
}

const RestaurantInfo = ({ 
  restaurant, 
  onBookingClick, 
  onViewMenuClick  // Add this prop
}: RestaurantInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{restaurant.name}</h1>
        <p className="text-muted-foreground">{restaurant.description}</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span>{restaurant.openHours}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <span>{restaurant.location}</span>
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button 
          onClick={onBookingClick} 
          className="flex-1"
        >
          Réserver une table
        </Button>
        {onViewMenuClick && (  // Conditionally render View Menu button
          <Button 
            onClick={onViewMenuClick} 
            variant="outline" 
            className="flex-1"
          >
            Voir le menu
          </Button>
        )}
      </div>
    </div>
  );
};

export default RestaurantInfo;
