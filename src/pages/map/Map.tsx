
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Compass, Search, Building, UtensilsCrossed, Heart, ShoppingBag } from 'lucide-react';
import Layout from '@/components/Layout';

const Map = () => {
  const locationCategories = [
    { id: 1, name: 'Rooms', icon: <Building className="h-5 w-5" /> },
    { id: 2, name: 'Dining', icon: <UtensilsCrossed className="h-5 w-5" /> },
    { id: 3, name: 'Wellness', icon: <Heart className="h-5 w-5" /> },
    { id: 4, name: 'Shops', icon: <ShoppingBag className="h-5 w-5" /> }
  ];

  const keyLocations = [
    { id: 1, name: 'Main Entrance', floor: 'Ground Floor', category: 'Access' },
    { id: 2, name: 'Reception Desk', floor: 'Ground Floor', category: 'Services' },
    { id: 3, name: 'Ocean View Restaurant', floor: 'Ground Floor', category: 'Dining' },
    { id: 4, name: 'Swimming Pool', floor: 'Level 3', category: 'Wellness' },
    { id: 5, name: 'Spa & Fitness Center', floor: 'Level 2', category: 'Wellness' },
    { id: 6, name: 'Conference Rooms', floor: 'Level 1', category: 'Business' }
  ];

  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-secondary mb-4">Hotel Map</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Navigate our hotel with ease using our interactive hotel map
        </p>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="search"
            placeholder="Search locations..."
            className="w-full pl-10 pr-4 py-3 rounded-xl text-base bg-white border shadow-sm"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="px-6 mb-6">
        <div className="flex overflow-x-auto gap-2 pb-2">
          {locationCategories.map(category => (
            <Button 
              key={category.id} 
              variant="outline" 
              className="flex-none flex items-center gap-2 px-4 py-2"
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Interactive Map */}
      <div className="px-6 mb-8">
        <Card className="overflow-hidden">
          <div className="relative h-80">
            <img 
              src="https://images.unsplash.com/photo-1592595896616-c37162298647?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
              alt="Hotel Floor Plan" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
              <p className="text-white text-lg font-semibold mb-4">Interactive Map Coming Soon</p>
              <Button>
                <MapPin className="mr-2 h-4 w-4" />
                View Demo
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Floor Selector */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold text-secondary mb-3">Select Floor</h2>
        <div className="flex justify-between gap-2 mb-3">
          {['Basement', 'Ground', 'Level 1', 'Level 2', 'Level 3'].map((floor, index) => (
            <Button 
              key={index} 
              variant={index === 1 ? "default" : "outline"} 
              className="flex-1 py-2"
            >
              {floor}
            </Button>
          ))}
        </div>
        <p className="text-sm text-gray-500">Showing Ground Floor locations</p>
      </div>

      {/* Key Locations */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold text-secondary mb-4">Key Locations</h2>
        <div className="space-y-2">
          {keyLocations.map(location => (
            <Card key={location.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-secondary">{location.name}</h3>
                  <p className="text-sm text-gray-600">{location.floor}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Compass className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Need Assistance */}
      <div className="px-6 mb-10">
        <Card className="bg-primary/5 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-secondary mb-3">Need Directions?</h3>
          <p className="text-gray-600 mb-4">
            Our concierge team can help you navigate the hotel and find any location you need.
          </p>
          <Button className="w-full">Contact Concierge</Button>
        </Card>
      </div>
    </Layout>
  );
};

export default Map;
