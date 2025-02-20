import React from 'react';
import { BedDouble, UtensilsCrossed, Calendar, PhoneCall, MapPin, Search, Bell, Menu, User } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import RoomList from '@/components/RoomList';
import DiningSection from '@/features/dining/components/DiningSection';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-optimized Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6 text-secondary" />
            </Button>
            <h1 className="text-2xl font-semibold text-secondary">Stay Genius</h1>
            <Button variant="ghost" size="icon">
              <User className="w-6 h-6 text-secondary" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content with padding for fixed header */}
      <main className="container mx-auto px-4 py-8 pt-20">
        {/* Search Section */}
        <section className="mb-6">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search for services, restaurants, activities..."
              className="w-full pl-10 pr-4 py-2 rounded-lg"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            <Button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3">
              <BedDouble className="w-5 h-5" />
              Book Room
            </Button>
            <Button className="w-full flex items-center justify-center gap-2 bg-primary-light text-primary py-3">
              <Bell className="w-5 h-5" />
              Request Service
            </Button>
          </div>
        </section>

        {/* Featured Rooms Carousel */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-secondary">Available Rooms</h2>
            <Button variant="ghost" className="text-primary text-sm">
              View All
            </Button>
          </div>
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <RoomList />
          </div>
        </section>

        {/* Dining Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-secondary">Restaurants & Dining</h2>
            <Button variant="ghost" className="text-primary text-sm">
              View All
            </Button>
          </div>
          <DiningSection />
        </section>

        {/* Services Grid */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-secondary mb-4">Hotel Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ServiceCard
              icon={<UtensilsCrossed />}
              title="Dining"
              description="View restaurants"
              action="Book Table"
            />
            <ServiceCard
              icon={<Calendar />}
              title="Activities"
              description="Explore events"
              action="See What's On"
            />
            <ServiceCard
              icon={<MapPin />}
              title="Local Guide"
              description="Discover area"
              action="Explore"
            />
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-xl font-semibold text-secondary mb-4">Recent Activity</h2>
          <Card className="p-4 animate-fade-in">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Room Service Delivered</p>
                <p className="text-xs text-gray-400">10 minutes ago</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Emergency Contact */}
        <div className="fixed bottom-6 right-6">
          <Button 
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary-dark"
          >
            <PhoneCall className="h-6 w-6" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
