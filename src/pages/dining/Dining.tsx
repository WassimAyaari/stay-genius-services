
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Clock, Coffee, Pizza, Wine, ChefHat, MapPin, Calendar, BookText } from 'lucide-react';
import Layout from '@/components/Layout';
import DiningSection from '@/features/dining/components/DiningSection';
import { Link, useNavigate } from 'react-router-dom';
import { Restaurant } from '@/features/dining/types';
import { useToast } from '@/hooks/use-toast';

const Dining = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const restaurants: Restaurant[] = [{
    id: '5',
    name: 'In-Room Dining',
    description: 'Private dining experience in the comfort of your room',
    cuisine: 'Room Service',
    images: [
      'https://images.unsplash.com/photo-1635320514247-71bc21ef2c83?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
    ],
    openHours: '24 Hours',
    location: 'Available in all rooms',
    status: 'open' as const
  }, {
    id: '1',
    name: 'Ocean View Restaurant',
    description: 'Enjoy international cuisine with breathtaking ocean views',
    cuisine: 'International',
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'],
    openHours: '7:00 AM - 11:00 PM',
    location: 'Main Building, Ground Floor',
    status: 'open' as const
  }, {
    id: '2',
    name: 'Sunrise Buffet',
    description: 'Extensive breakfast and dinner buffet with global flavors',
    cuisine: 'Buffet',
    images: ['https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1174&q=80'],
    openHours: '6:30 AM - 10:30 AM, 6:00 PM - 10:30 PM',
    location: 'Main Building, First Floor',
    status: 'open' as const
  }, {
    id: '3',
    name: 'Seaside Grill',
    description: 'Fresh seafood and premium steaks by the beach',
    cuisine: 'Steakhouse & Seafood',
    images: [
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
    ],
    openHours: '12:00 PM - 3:00 PM, 6:00 PM - 10:00 PM',
    location: 'Beach Area',
    status: 'open' as const
  }, {
    id: '4',
    name: 'Poolside Bar & Bistro',
    description: 'Light meals and refreshing drinks by the pool',
    cuisine: 'Snacks & Beverages',
    images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'],
    openHours: '10:00 AM - 8:00 PM',
    location: 'Pool Area',
    status: 'open' as const
  }];

  const handleBookTable = (restaurant: Restaurant) => {
    navigate(`/dining/${restaurant.id}`, { state: { openBooking: true } });
  };

  return <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-secondary mb-4">Dining Experiences</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover culinary excellence at our restaurants, where every meal becomes a memorable experience
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {restaurants.map(restaurant => <Card key={restaurant.id} className="overflow-hidden animate-fade-in">
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
                  onClick={() => handleBookTable(restaurant)}
                  className="w-full flex items-center justify-center gap-1"
                >
                  <Calendar size={16} />
                  Book a Table
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
          </Card>)}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-secondary mb-6">Featured Restaurants</h2>
        <DiningSection />
      </div>
    </Layout>;
};

export default Dining;
