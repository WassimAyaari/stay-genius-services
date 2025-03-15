
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  UtensilsCrossed, 
  Clock, 
  Coffee, 
  Pizza, 
  Wine, 
  ChefHat,
  MapPin
} from 'lucide-react';
import Layout from '@/components/Layout';
import DiningSection from '@/features/dining/components/DiningSection';

const Dining = () => {
  const restaurants = [
    {
      id: '1',
      name: 'Ocean View Restaurant',
      description: 'Enjoy international cuisine with breathtaking ocean views',
      cuisine: 'International',
      images: ['/placeholder.svg'],
      openHours: '7:00 AM - 11:00 PM',
      location: 'Main Building, Ground Floor',
      status: 'open' as const
    },
    {
      id: '2',
      name: 'Sunrise Buffet',
      description: 'Extensive breakfast and dinner buffet with global flavors',
      cuisine: 'Buffet',
      images: ['/placeholder.svg'],
      openHours: '6:30 AM - 10:30 AM, 6:00 PM - 10:30 PM',
      location: 'Main Building, First Floor',
      status: 'open' as const
    },
    {
      id: '3',
      name: 'Seaside Grill',
      description: 'Fresh seafood and premium steaks by the beach',
      cuisine: 'Steakhouse & Seafood',
      images: ['/placeholder.svg'],
      openHours: '12:00 PM - 3:00 PM, 6:00 PM - 10:00 PM',
      location: 'Beach Area',
      status: 'open' as const
    },
    {
      id: '4',
      name: 'Poolside Bar & Bistro',
      description: 'Light meals and refreshing drinks by the pool',
      cuisine: 'Snacks & Beverages',
      images: ['/placeholder.svg'],
      openHours: '10:00 AM - 8:00 PM',
      location: 'Pool Area',
      status: 'open' as const
    },
    {
      id: '5',
      name: 'In-Room Dining',
      description: 'Private dining experience in the comfort of your room',
      cuisine: 'Room Service',
      images: ['/placeholder.svg'],
      openHours: '24 Hours',
      location: 'Available in all rooms',
      status: 'open' as const
    }
  ];

  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-secondary mb-4">Dining Experiences</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover culinary excellence at our restaurants, where every meal becomes a memorable experience
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {restaurants.map(restaurant => (
          <Card key={restaurant.id} className="overflow-hidden animate-fade-in">
            <img 
              src={restaurant.images[0]}
              alt={restaurant.name}
              className="w-full h-48 object-cover"
            />
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
              <Button className="w-full">Reserve a Table</Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-secondary mb-6">Featured Restaurants</h2>
        <DiningSection />
      </div>
    </Layout>
  );
};

export default Dining;
