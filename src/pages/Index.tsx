
import React from 'react';
import { BedDouble, UtensilsCrossed, Calendar, PhoneCall, MapPin } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import RoomList from '@/components/RoomList';
import { Card } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-secondary">Stay Genius</h1>
            <button className="text-primary hover:text-primary-dark">
              <PhoneCall className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Room List Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-secondary mb-4">Available Rooms</h2>
          <RoomList />
        </section>

        {/* Services Grid */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-secondary mb-4">Hotel Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ServiceCard
              icon={<BedDouble />}
              title="Room Service"
              description="Order food and beverages to your room"
              status="Available"
              action="Order Now"
            />
            <ServiceCard
              icon={<UtensilsCrossed />}
              title="Restaurants"
              description="Browse our dining options"
              action="View Menus"
            />
            <ServiceCard
              icon={<Calendar />}
              title="Activities"
              description="Explore pool and fitness activities"
              action="Discover More"
            />
            <ServiceCard
              icon={<MapPin />}
              title="Local Guide"
              description="Discover nearby attractions"
              action="Explore Area"
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-secondary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 text-center bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              Request Service
            </button>
            <button className="p-4 text-center bg-primary-light text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
              Contact Concierge
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
