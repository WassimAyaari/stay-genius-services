
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Restaurant } from '@/features/dining/types';
import { UtensilsCrossed, Clock, MapPin, ChevronLeft, Calendar, BookText, Star } from 'lucide-react';

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // These restaurants would typically come from a database
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
    description: 'Enjoy international cuisine with breathtaking ocean views. Our chefs prepare a variety of international dishes using fresh, local ingredients. The panoramic ocean view provides the perfect backdrop for a memorable dining experience.',
    cuisine: 'International',
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'],
    openHours: '7:00 AM - 11:00 PM',
    location: 'Main Building, Ground Floor',
    status: 'open' as const
  }, {
    id: '2',
    name: 'Sunrise Buffet',
    description: 'Extensive breakfast and dinner buffet with global flavors. Start your day with our grand breakfast buffet featuring both local and international favorites. In the evening, enjoy a diverse dinner buffet with live cooking stations.',
    cuisine: 'Buffet',
    images: ['https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1174&q=80'],
    openHours: '6:30 AM - 10:30 AM, 6:00 PM - 10:30 PM',
    location: 'Main Building, First Floor',
    status: 'open' as const
  }, {
    id: '3',
    name: 'Seaside Grill',
    description: 'Fresh seafood and premium steaks by the beach. Dine with your feet in the sand as our chefs grill the freshest seafood and premium cuts of meat to perfection. Enjoy the sound of waves and breathtaking sunset views while you savor your meal.',
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
    description: 'Light meals and refreshing drinks by the pool. Take a break from swimming and enjoy light bites, refreshing cocktails, and tropical drinks without leaving the pool area. Our menu features salads, sandwiches, and a variety of snacks perfect for a casual poolside meal.',
    cuisine: 'Snacks & Beverages',
    images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'],
    openHours: '10:00 AM - 8:00 PM',
    location: 'Pool Area',
    status: 'open' as const
  }];

  const restaurant = restaurants.find(r => r.id === id);

  if (!restaurant) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-2xl font-semibold text-secondary mb-4">Restaurant not found</h2>
          <Button onClick={() => navigate('/dining')}>Back to Dining</Button>
        </div>
      </Layout>
    );
  }

  const handleBookTable = () => {
    toast({
      title: "Reservation request sent",
      description: `Your booking request for ${restaurant.name} has been received. We'll confirm shortly.`,
    });
  };

  const handleGetMenu = () => {
    toast({
      title: "Menu downloaded",
      description: `The menu for ${restaurant.name} has been downloaded to your device.`,
    });
  };

  return (
    <Layout>
      <div className="mb-8">
        <button 
          onClick={() => navigate('/dining')}
          className="flex items-center text-primary hover:text-primary-dark mb-4"
        >
          <ChevronLeft size={20} />
          <span>Back to Dining</span>
        </button>

        <div className="relative h-64 md:h-80 lg:h-96 mb-6 overflow-hidden rounded-lg">
          <div className="flex h-full transition-transform duration-500 ease-in-out">
            {restaurant.images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`${restaurant.name} - view ${index + 1}`}
                className="w-full h-full object-cover flex-shrink-0"
              />
            ))}
          </div>
          {restaurant.images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {restaurant.images.map((_, index) => (
                <span 
                  key={index}
                  className="h-2 w-2 rounded-full bg-white shadow-lg"
                />
              ))}
            </div>
          )}
          <div className="absolute top-4 right-4">
            <span className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${restaurant.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
            `}>
              {restaurant.status}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-secondary mb-2">{restaurant.name}</h1>
          <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <UtensilsCrossed className="w-4 h-4" />
              <span>{restaurant.cuisine}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{restaurant.openHours}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.8 (120 reviews)</span>
            </div>
          </div>
          <p className="text-gray-700">{restaurant.description}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            size="lg" 
            className="flex-1"
            onClick={handleBookTable}
          >
            <Calendar className="mr-2" size={20} />
            Book a Table
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            className="flex-1"
            onClick={handleGetMenu}
          >
            <BookText className="mr-2" size={20} />
            Get The Menu
          </Button>
        </div>

        <Separator className="my-8" />

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-secondary mb-4">Featured Dishes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* This would typically be populated from a database */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-100 animate-pulse"></div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">Signature Dish</h3>
                <p className="text-gray-600 text-sm">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantDetail;
