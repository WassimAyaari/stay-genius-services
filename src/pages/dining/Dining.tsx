
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Clock, Coffee, Pizza, Wine, ChefHat, MapPin, Calendar, BookText } from 'lucide-react';
import Layout from '@/components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useToast } from '@/hooks/use-toast';

const Dining = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { restaurants, isLoading } = useRestaurants();
  
  const handleBookTable = (restaurantId: string) => {
    navigate(`/dining/${restaurantId}`, { state: { openBooking: true } });
  };

  return <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-secondary mb-4">Dining Experiences</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover culinary excellence at our restaurants, where every meal becomes a memorable experience
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-pulse text-gray-400">Loading restaurants...</div>
        </div>
      ) : !restaurants || restaurants.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-400">No restaurants available at the moment.</div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {restaurants.map(restaurant => (
            <Card key={restaurant.id} className="overflow-hidden animate-fade-in">
              <div className="relative">
                <img 
                  src={restaurant.images[0]} 
                  alt={restaurant.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${restaurant.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  `}>
                    {restaurant.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-secondary mb-2">{restaurant.name}</h3>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>{restaurant.cuisine}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>{restaurant.openHours}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.location}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{restaurant.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => handleBookTable(restaurant.id)}
                    className="w-full flex items-center justify-center gap-1"
                  >
                    <Calendar size={16} />
                    {restaurant.actionText || "Book a Table"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-1"
                    onClick={() => navigate(`/dining/${restaurant.id}`)}
                  >
                    <BookText size={16} />
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>;
};

export default Dining;
