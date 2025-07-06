
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Car, Landmark, ShoppingBag, Ticket } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Destination = () => {
  // Fetch destination categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['destinationCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destination_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });
  
  // Fetch attractions
  const { data: attractions, isLoading: isLoadingAttractions } = useQuery({
    queryKey: ['attractions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });
  
  // Fetch activities
  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destination_activities')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });
  
  // Fetch car rentals
  const { data: carRentals, isLoading: isLoadingCarRentals } = useQuery({
    queryKey: ['carRentals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('car_rentals')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });
  
  // Fetch public transport options
  const { data: publicTransport, isLoading: isLoadingTransport } = useQuery({
    queryKey: ['publicTransport'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_transport')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Default to showing some UI even when there's no data yet
  const defaultCategories = [
    { id: '1', name: 'Nearby', icon: '' },
    { id: '2', name: 'Landmarks', icon: '' },
    { id: '3', name: 'Cafés', icon: '' },
    { id: '4', name: 'Shopping', icon: '' }
  ];

  // Use dynamic categories if available, otherwise use defaults
  const displayCategories = categories?.length ? categories : defaultCategories;
  
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
            {isLoadingCategories ? (
              // Show skeleton loading state
              Array(4).fill(0).map((_, index) => (
                <Button key={index} variant="outline" className="flex-col h-auto py-3 opacity-50" disabled>
                  <div className="w-6 h-6 rounded-full bg-muted mb-1"></div>
                  <div className="w-12 h-3 bg-muted rounded"></div>
                </Button>
              ))
            ) : (
              displayCategories.map((category) => (
                <Button key={category.id} variant="outline" className="flex-col h-auto py-3">
                  {category.icon ? (
                    <img src={category.icon} alt={category.name} className="h-6 w-6 mb-1" />
                  ) : (
                    getCategoryIcon(category.name)
                  )}
                  <span className="text-xs">{category.name}</span>
                </Button>
              ))
            )}
          </div>
        </div>

        {/* Recommended Places */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">Popular Attractions</h2>
          <div className="space-y-4">
            {isLoadingAttractions ? (
              // Loading state
              Array(3).fill(0).map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse">
                  <div className="flex">
                    <div className="w-1/3 h-40 bg-muted"></div>
                    <div className="w-2/3 p-4">
                      <div className="h-5 bg-muted rounded mb-2 w-1/2"></div>
                      <div className="h-3 bg-muted rounded mb-2 w-3/4"></div>
                      <div className="h-10 bg-muted rounded mb-2"></div>
                      <div className="h-8 bg-muted rounded w-1/4"></div>
                    </div>
                  </div>
                </Card>
              ))
            ) : attractions && attractions.length > 0 ? (
              attractions.map((attraction) => (
                <Card key={attraction.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="w-1/3 h-40">
                      <img 
                        src={attraction.image} 
                        alt={attraction.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <h3 className="font-semibold mb-1">{attraction.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{attraction.distance}</span>
                        <span className="mx-2">•</span>
                        <span>{attraction.opening_hours}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{attraction.description}</p>
                      <Button size="sm" variant="outline" className="text-xs">Get Directions</Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              // Default content when no attractions are available
              <>
                <Card className="overflow-hidden">
                  <div className="flex">
                    <div className="w-1/3 h-40">
                      <img 
                        src="https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2834&q=80" 
                        alt="Historic Mosque" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <h3 className="font-semibold mb-1">Grand Central Mosque</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>800m away</span>
                        <span className="mx-2">•</span>
                        <span>Open 5 AM - 10 PM</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Historic 16th-century mosque featuring stunning Islamic architecture and peaceful gardens.</p>
                      <Button size="sm" variant="outline" className="text-xs">Get Directions</Button>
                    </div>
                  </div>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="flex">
                    <div className="w-1/3 h-40">
                      <img 
                        src="https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2671&q=80" 
                        alt="Historic Theatre" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <h3 className="font-semibold mb-1">Royal Opera Theatre</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>1.1 km away</span>
                        <span className="mx-2">•</span>
                        <span>Box office: 10 AM - 8 PM</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Elegant 19th-century theatre hosting world-class opera, ballet, and classical performances.</p>
                      <Button size="sm" variant="outline" className="text-xs">Get Directions</Button>
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden">
                  <div className="flex">
                    <div className="w-1/3 h-40">
                      <img 
                        src="https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=4000&q=80" 
                        alt="Scenic Bridge" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <h3 className="font-semibold mb-1">Heritage Stone Bridge</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>2.3 km away</span>
                        <span className="mx-2">•</span>
                        <span>Open 24 hours</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Medieval stone bridge with breathtaking waterfall views and historic walking trails.</p>
                      <Button size="sm" variant="outline" className="text-xs">Get Directions</Button>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Activities Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">Things To Do</h2>
          <div className="grid grid-cols-2 gap-4">
            {isLoadingActivities ? (
              // Loading state
              Array(2).fill(0).map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse">
                  <div className="h-40 bg-muted"></div>
                  <div className="p-3">
                    <div className="h-5 bg-muted rounded mb-2 w-1/2"></div>
                    <div className="h-3 bg-muted rounded mb-3 w-3/4"></div>
                    <div className="h-8 bg-muted rounded w-full"></div>
                  </div>
                </Card>
              ))
            ) : activities && activities.length > 0 ? (
              activities.map((activity) => (
                <Card key={activity.id} className="overflow-hidden">
                  <div className="h-40 relative">
                    <img 
                      src={activity.image} 
                      alt={activity.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-3 text-white">
                      <h3 className="font-semibold">{activity.name}</h3>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                    <Button size="sm" className="w-full">Book Now</Button>
                  </div>
                </Card>
              ))
            ) : (
              // Default content when no activities are available
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Transportation */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-secondary mb-4">Getting Around</h2>
          
          {/* Car Rental */}
          {isLoadingCarRentals ? (
            <Card className="p-4 rounded-xl mb-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="bg-muted p-2 rounded-lg h-9 w-9"></div>
                <div className="flex-1">
                  <div className="h-5 bg-muted rounded mb-2 w-1/3"></div>
                  <div className="h-3 bg-muted rounded mb-3 w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            </Card>
          ) : carRentals && carRentals.length > 0 ? (
            carRentals.map((carRental) => (
              <Card key={carRental.id} className="p-4 rounded-xl mb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{carRental.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{carRental.description}</p>
                    {carRental.website ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => window.open(carRental.website, '_blank')}
                      >
                        Visit Website
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline">Book a Car</Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
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
          )}
          
          {/* Public Transportation */}
          {isLoadingTransport ? (
            <Card className="p-4 rounded-xl animate-pulse">
              <div className="flex items-start gap-3">
                <div className="bg-muted p-2 rounded-lg h-9 w-9"></div>
                <div className="flex-1">
                  <div className="h-5 bg-muted rounded mb-2 w-1/3"></div>
                  <div className="h-3 bg-muted rounded mb-3 w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            </Card>
          ) : publicTransport && publicTransport.length > 0 ? (
            publicTransport.map((transport) => (
              <Card key={transport.id} className="p-4 rounded-xl mb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Ticket className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{transport.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{transport.description}</p>
                    {transport.website ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => window.open(transport.website, '_blank')}
                      >
                        Visit Website
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline">View Options</Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
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
          )}
        </div>
      </div>
    </Layout>
  );
};

// Helper function to get icons based on category name
const getCategoryIcon = (name: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Nearby': <Navigation className="h-6 w-6 mb-1" />,
    'Landmarks': <Landmark className="h-6 w-6 mb-1" />,
    'Cafés': <div className="h-6 w-6 mb-1 flex items-center justify-center">☕</div>,
    'Shopping': <ShoppingBag className="h-6 w-6 mb-1" />,
  };
  
  return iconMap[name] || <Navigation className="h-6 w-6 mb-1" />;
};

export default Destination;
