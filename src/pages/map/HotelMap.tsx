
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Elevator, Utensils, Coffee, LifeBuoy, Dumbbell, Wifi, DoorClosed } from 'lucide-react';
import { Input } from '@/components/ui/input';

const HotelMap = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="relative mb-8">
          <Input
            type="search"
            placeholder="Search for locations, rooms, or facilities..."
            className="w-full pl-12 pr-4 py-4 rounded-xl text-base bg-white shadow-lg"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        
        {/* Interactive Map */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">Hotel Map</h2>
          <Card className="p-0 rounded-xl overflow-hidden mb-4">
            <div className="relative h-[400px] bg-gray-100">
              {/* This would be your interactive map component */}
              <img 
                src="https://images.unsplash.com/photo-1580846062738-c9558ed4d26b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
                alt="Hotel Map" 
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-2">Interactive Map</h3>
                  <p className="mb-4">Explore our hotel facilities and navigate with ease</p>
                  <Button>View Full Screen</Button>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Floor Selector */}
          <div className="flex overflow-x-auto gap-2 pb-2 mb-4">
            <Button variant="outline" className="whitespace-nowrap min-w-[80px]">Ground Floor</Button>
            <Button variant="outline" className="whitespace-nowrap min-w-[80px]">Floor 1</Button>
            <Button variant="outline" className="whitespace-nowrap min-w-[80px]">Floor 2</Button>
            <Button variant="outline" className="whitespace-nowrap min-w-[80px]">Floor 3</Button>
            <Button variant="outline" className="whitespace-nowrap min-w-[80px]">Floor 4</Button>
            <Button variant="outline" className="whitespace-nowrap min-w-[80px]">Floor 5</Button>
          </div>
        </div>
        
        {/* Key Facilities */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">Key Facilities</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Utensils className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Restaurants</h3>
                  <p className="text-xs text-gray-500">Ground & 5th Floor</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Coffee className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Cafés & Bars</h3>
                  <p className="text-xs text-gray-500">Ground & 1st Floor</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <LifeBuoy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Swimming Pools</h3>
                  <p className="text-xs text-gray-500">3rd Floor</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Gym & Wellness</h3>
                  <p className="text-xs text-gray-500">2nd Floor</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Elevator className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Elevators</h3>
                  <p className="text-xs text-gray-500">All Floors</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <DoorClosed className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Room Access</h3>
                  <p className="text-xs text-gray-500">Floors 1-5</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Quick Info */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">Hotel Information</h2>
          <Card className="p-6 rounded-xl mb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Wifi className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Wi-Fi Access</h3>
                <p className="text-sm text-gray-600 mb-2">Free high-speed Wi-Fi available throughout the hotel. Connect to "HotelGenius_Guest" network.</p>
                <Button size="sm" variant="outline">Connect to Wi-Fi</Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 rounded-xl">
            <h3 className="font-semibold mb-2">Emergency Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Emergency Exit</span>
                <span className="text-sm font-medium">End of each hallway</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Medical Assistance</span>
                <span className="text-sm font-medium">Dial 9 from room</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Fire Alarms</span>
                <span className="text-sm font-medium">Throughout the hotel</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default HotelMap;
