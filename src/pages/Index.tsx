
import React from 'react';
import { BedDouble, UtensilsCrossed, Calendar, PhoneCall, MapPin, Search, Bell, Menu, User, Sun, Clock, Heart } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import RoomList from '@/components/RoomList';
import DiningSection from '@/features/dining/components/DiningSection';
import SpaSection from '@/features/spa/components/SpaSection';
import ActivitiesSection from '@/features/activities/components/ActivitiesSection';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pt-20">
        {/* Welcome Section */}
        <section className="mb-8">
          <Card className="p-6 bg-gradient-to-r from-primary-light to-white border-none">
            <div className="flex items-center gap-3 mb-4">
              <Sun className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold text-secondary">Good Morning</h2>
                <p className="text-sm text-gray-600">Welcome to Stay Genius</p>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Button className="bg-white text-primary hover:bg-primary hover:text-white">
                <Clock className="w-4 h-4 mr-2" />
                Check-in: 3 PM
              </Button>
              <Button className="bg-white text-primary hover:bg-primary hover:text-white">
                <Clock className="w-4 h-4 mr-2" />
                Check-out: 11 AM
              </Button>
            </div>
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            <Button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-6 text-lg">
              <BedDouble className="w-6 h-6" />
              Book Room
            </Button>
            <Button className="w-full flex items-center justify-center gap-2 bg-secondary text-white py-6 text-lg">
              <PhoneCall className="w-6 h-6" />
              Call Concierge
            </Button>
          </div>
        </section>

        {/* Search Section with Context */}
        <section className="mb-8">
          <div className="relative">
            <Input
              type="search"
              placeholder="Find restaurants, spa services, or activities..."
              className="w-full pl-10 pr-4 py-3 rounded-lg text-base"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </section>

        {/* Today's Highlights */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-secondary mb-4">Today's Highlights</h2>
          <div className="space-y-4">
            <Card className="p-4 animate-fade-in bg-accent/50">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-secondary">Wine Tasting</p>
                  <p className="text-sm text-gray-600">Today at 6 PM - Wine Cellar</p>
                </div>
                <Button variant="outline" className="ml-auto" size="sm">
                  Book Now
                </Button>
              </div>
            </Card>
            <Card className="p-4 animate-fade-in bg-accent/50">
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-secondary">Chef's Special Dinner</p>
                  <p className="text-sm text-gray-600">Tonight at 7 PM - Main Restaurant</p>
                </div>
                <Button variant="outline" className="ml-auto" size="sm">
                  Reserve
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Featured Rooms */}
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

        {/* Quick Services Grid */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-secondary mb-4">Hotel Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ServiceCard
              icon={<UtensilsCrossed />}
              title="Dining"
              description="Restaurant reservations"
              action="Book Table"
            />
            <ServiceCard
              icon={<Heart />}
              title="Spa & Wellness"
              description="Relaxation awaits"
              action="Book Service"
            />
            <ServiceCard
              icon={<MapPin />}
              title="Local Guide"
              description="Explore the area"
              action="Discover"
            />
          </div>
        </section>

        {/* Other Sections */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-secondary">Restaurants & Dining</h2>
            <Button variant="ghost" className="text-primary text-sm">
              View All
            </Button>
          </div>
          <DiningSection />
        </section>

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-secondary">Spa & Wellness</h2>
            <Button variant="ghost" className="text-primary text-sm">
              View All
            </Button>
          </div>
          <SpaSection />
        </section>

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-secondary">Activities & Events</h2>
            <Button variant="ghost" className="text-primary text-sm">
              View All
            </Button>
          </div>
          <ActivitiesSection />
        </section>

        {/* Emergency Contact */}
        <div className="fixed bottom-6 right-6">
          <Button 
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg bg-red-500 hover:bg-red-600 animate-pulse"
          >
            <PhoneCall className="h-6 w-6" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
