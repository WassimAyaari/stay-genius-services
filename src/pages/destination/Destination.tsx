
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Car, Landmark, Coffee, ShoppingBag, Ticket, Palmtree } from 'lucide-react';

const Destination = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-8 rounded-3xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="City View" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Explore Our Destination</h1>
            <p className="text-xl mb-6">Discover the wonders of our city</p>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">Discover</h2>
          <div className="grid grid-cols-4 gap-3">
            <Button variant="outline" className="flex-col h-auto py-3">
              <Navigation className="h-6 w-6 mb-1" />
              <span className="text-xs">Nearby</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-3">
              <Landmark className="h-6 w-6 mb-1" />
              <span className="text-xs">Landmarks</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-3">
              <Coffee className="h-6 w-6 mb-1" />
              <span className="text-xs">Cafés</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-3">
              <ShoppingBag className="h-6 w-6 mb-1" />
              <span className="text-xs">Shopping</span>
            </Button>
          </div>
        </div>

        {/* Recommended Places */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">Popular Attractions</h2>
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="flex">
                <div className="w-1/3 h-32">
                  <img 
                    src="https://images.unsplash.com/photo-1577979749830-f1d742b96791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" 
                    alt="Museum" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-2/3 p-4">
                  <h3 className="font-semibold mb-1">Art Museum</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>1.2 km away</span>
                    <span className="mx-2">•</span>
                    <span>Open until 6 PM</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">World-class art collection featuring both classical and contemporary works.</p>
                  <Button size="sm" variant="outline" className="text-xs">Get Directions</Button>
                </div>
              </div>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="flex">
                <div className="w-1/3 h-32">
                  <img 
                    src="https://images.unsplash.com/photo-1514565131-fce0801e5785?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" 
                    alt="Beach" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-2/3 p-4">
                  <h3 className="font-semibold mb-1">Golden Beach</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>3.5 km away</span>
                    <span className="mx-2">•</span>
                    <span>Open 24 hours</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Beautiful sandy beach with crystal clear waters and stunning sunset views.</p>
                  <Button size="sm" variant="outline" className="text-xs">Get Directions</Button>
                </div>
              </div>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="flex">
                <div className="w-1/3 h-32">
                  <img 
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                    alt="Restaurant" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-2/3 p-4">
                  <h3 className="font-semibold mb-1">Historic District</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>0.8 km away</span>
                    <span className="mx-2">•</span>
                    <span>Always open</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Charming historic area with cobblestone streets, local shops, and restaurants.</p>
                  <Button size="sm" variant="outline" className="text-xs">Get Directions</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Activities Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">Things To Do</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="overflow-hidden">
              <div className="h-40 relative">
                <img 
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="City Tour" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-3 text-white">
                  <h3 className="font-semibold">City Tour</h3>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm text-gray-600 mb-3">Explore the city highlights with our guided tours.</p>
                <Button size="sm" className="w-full">Book Tour</Button>
              </div>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-40 relative">
                <img 
                  src="https://images.unsplash.com/photo-1499591934045-40b55745b12f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80" 
                  alt="Boat Trip" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-3 text-white">
                  <h3 className="font-semibold">Boat Trip</h3>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm text-gray-600 mb-3">Scenic boat rides along the coast with snorkeling options.</p>
                <Button size="sm" className="w-full">Book Trip</Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Transportation */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-secondary mb-4">Getting Around</h2>
          <Card className="p-4 rounded-xl mb-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Car Rental</h3>
                <p className="text-sm text-gray-600 mb-2">Rental services available at the hotel. Reserve a car for your exploration.</p>
                <Button size="sm" variant="outline">Book a Car</Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Ticket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Public Transportation</h3>
                <p className="text-sm text-gray-600 mb-2">Information about buses, trains, and other public transport options.</p>
                <Button size="sm" variant="outline">View Options</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Destination;
