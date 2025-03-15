
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Calendar, Compass, Car, Bus, Train } from 'lucide-react';
import Layout from '@/components/Layout';

const Destination = () => {
  const attractions = [
    {
      id: 1,
      name: 'Historic City Center',
      type: 'Cultural',
      description: 'Explore the historic downtown area with architecture dating back to the 18th century.',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1096&q=80',
      distance: '1.5 km',
      duration: '2-3 hours'
    },
    {
      id: 2,
      name: 'Ocean Bay Beach',
      type: 'Nature',
      description: 'Pristine sandy beach with crystal clear waters, perfect for swimming and sunbathing.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80',
      distance: '3 km',
      duration: 'Half day'
    },
    {
      id: 3,
      name: 'Mountain Trails',
      type: 'Adventure',
      description: 'Scenic hiking trails with breathtaking views of the surrounding landscape.',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      distance: '5 km',
      duration: '4-5 hours'
    }
  ];

  const transportOptions = [
    {
      id: 1,
      name: 'Car Rental',
      icon: <Car className="h-6 w-6 text-primary" />,
      description: 'Rent a car directly from the hotel'
    },
    {
      id: 2,
      name: 'Public Transport',
      icon: <Bus className="h-6 w-6 text-primary" />,
      description: 'Bus and metro stations nearby'
    },
    {
      id: 3,
      name: 'Train Station',
      icon: <Train className="h-6 w-6 text-primary" />,
      description: '10 minute drive from hotel'
    }
  ];

  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-secondary mb-4">Destination Guide</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the best attractions, activities, and hidden gems in our area
        </p>
      </div>

      {/* Featured Map Section */}
      <section className="px-6 mb-10">
        <Card className="overflow-hidden">
          <div className="relative h-48">
            <img 
              src="https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1631&q=80" 
              alt="City Map" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button size="lg" className="bg-white/80 backdrop-blur-sm text-primary hover:bg-white hover:text-primary/90">
                <Navigation className="mr-2 h-5 w-5" />
                Interactive Map
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Popular Attractions */}
      <section className="px-6 mb-10">
        <h2 className="text-2xl font-bold text-secondary mb-4">Popular Attractions</h2>
        <div className="space-y-6">
          {attractions.map(attraction => (
            <Card key={attraction.id} className="overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={attraction.image} 
                  alt={attraction.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-primary/80 text-white px-3 py-1 text-sm">
                  {attraction.type}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-secondary mb-1">{attraction.name}</h3>
                <p className="text-gray-600 mb-3">{attraction.description}</p>
                
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{attraction.distance} from hotel</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>Recommended time: {attraction.duration}</span>
                </div>
                
                <Button className="w-full">
                  <Compass className="mr-2 h-4 w-4" />
                  Plan Visit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Transportation */}
      <section className="px-6 mb-10">
        <h2 className="text-2xl font-bold text-secondary mb-4">Getting Around</h2>
        <Card className="p-4">
          <div className="grid grid-cols-1 gap-4">
            {transportOptions.map(option => (
              <div key={option.id} className="flex items-center gap-4 p-3 border-b last:border-0">
                <div className="bg-primary/10 p-3 rounded-full">
                  {option.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-secondary">{option.name}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Local Tips */}
      <section className="px-6 mb-10">
        <h2 className="text-2xl font-bold text-secondary mb-4">Local Tips</h2>
        <Card className="bg-primary/5 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-secondary mb-3">Ask Our Concierge</h3>
          <p className="text-gray-600 mb-4">
            Our concierge team has expert knowledge of the area and can provide personalized recommendations for your stay.
          </p>
          <Button className="w-full">Contact Concierge</Button>
        </Card>
      </section>
    </Layout>
  );
};

export default Destination;
