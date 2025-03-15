import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UtensilsCrossed, 
  Heart, 
  Map, 
  Search, 
  CalendarDays, 
  Compass, 
  Percent, 
  Info, 
  ShoppingBag, 
  Wine,
  Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative mb-8">
        <div className="relative h-64 overflow-hidden rounded-b-3xl">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Hotel Exterior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Welcome to Your Stay Guide</h1>
            <p className="text-xl mb-6">Discover luxury and comfort</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="absolute -bottom-6 left-6 right-6">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search for services, activities, or amenities..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-base bg-white shadow-lg border-none"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Main Services Section - Updated to match menu structure */}
      <section className="px-6 mb-10 mt-8">
        <h2 className="text-2xl font-bold text-secondary mb-4">Main Services</h2>
        <div className="grid grid-cols-2 gap-4">
          <ServiceCard 
            icon={<Info className="w-6 h-6 text-primary" />}
            title="About Us"
            description="Hotel information"
            actionText="Learn More"
            actionLink="/about"
            status="Available"
          />
          
          <ServiceCard 
            icon={<UtensilsCrossed className="w-6 h-6 text-primary" />}
            title="Gastronomy"
            description="Fine dining experiences"
            actionText="Reserve Table"
            actionLink="/dining"
            status="Open"
          />
          
          <ServiceCard 
            icon={<Compass className="w-6 h-6 text-primary" />}
            title="Destination"
            description="Things to do"
            actionText="Explore"
            actionLink="/destination"
            status="Available"
          />
          
          <ServiceCard 
            icon={<Heart className="w-6 h-6 text-primary" />}
            title="Spa & Wellness"
            description="Relax and rejuvenate"
            actionText="Book Treatment"
            actionLink="/spa"
            status="Available"
          />
        </div>
      </section>

      {/* Featured Experience - Kept as requested */}
      <section className="px-6 mb-10">
        <h2 className="text-2xl font-bold text-secondary mb-4">Featured Experience</h2>
        <Card className="overflow-hidden">
          <div className="relative h-64">
            <img 
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Spa Treatment" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <span className="text-sm font-medium bg-primary/50 backdrop-blur-sm px-3 py-1 rounded-full mb-2 inline-block">Spa & Wellness</span>
              <h3 className="text-2xl font-bold">Luxury Spa Treatments</h3>
            </div>
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
              1 / 2
            </div>
          </div>
          <div className="p-4">
            <p className="text-gray-600 mb-4">Indulge in our signature spa treatments for ultimate relaxation</p>
            <Button className="w-full" onClick={() => {}}>
              Explore Now
            </Button>
          </div>
        </Card>
      </section>

      {/* Today's Highlights Section - Kept as requested */}
      <section className="px-6 mb-10">
        <h2 className="text-2xl font-bold text-secondary mb-4">Today's Highlights</h2>
        <div className="grid grid-cols-1 gap-4">
          <Card className="overflow-hidden">
            <div className="flex items-center">
              <div className="relative w-1/3 h-32">
                <img 
                  src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="Wine Tasting" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Wine className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-secondary">Wine Tasting</h3>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Today</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">Today at 6 PM - Wine Cellar</p>
                <Link to="/activities">
                  <Button size="sm" className="w-full sm:w-auto">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center">
              <div className="relative w-1/3 h-32">
                <img 
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="Chef's Special Dinner" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-secondary">Chef's Special Dinner</h3>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Tonight</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">Tonight at 7 PM - Main Restaurant</p>
                <Link to="/dining">
                  <Button size="sm" className="w-full sm:w-auto">
                    Reserve
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Additional Services - Updated to match menu structure */}
      <section className="px-6 mb-10">
        <h2 className="text-2xl font-bold text-secondary mb-4">Additional Services</h2>
        <div className="grid grid-cols-2 gap-4">
          <ServiceCard 
            icon={<ShoppingBag className="w-6 h-6 text-primary" />}
            title="Shops"
            description="Luxury shopping experience"
            actionText="Shop Now"
            actionLink="/shops"
            status="Open"
          />
          
          <ServiceCard 
            icon={<Map className="w-6 h-6 text-primary" />}
            title="Hotel Map"
            description="Interactive indoor navigation"
            actionText="Open Map"
            actionLink="/map"
            status="Available"
          />
        </div>
      </section>

      {/* Need Assistance */}
      <section className="px-6 mb-10">
        <Link to="/contact">
          <Card className="bg-primary text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Need Assistance?</h3>
                  <p className="text-sm">We're here to help 24/7</p>
                </div>
              </div>
              <div className="bg-white rounded-full p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M12 5L18 11M12 5L6 11" stroke="#00AFB9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Card>
        </Link>
      </section>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ 
  icon, 
  title, 
  description, 
  actionText, 
  actionLink, 
  status,
  highlighted = false 
}) => {
  return (
    <Card className={`overflow-hidden ${highlighted ? 'border-2 border-primary rounded-2xl' : 'rounded-2xl'}`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="p-2.5 bg-gray-100 rounded-lg">
            {icon}
          </div>
          <span className="text-gray-500 text-sm">{status}</span>
        </div>
        <h3 className="text-xl font-bold text-secondary mb-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        <Link 
          to={actionLink}
          className={`text-sm font-medium flex items-center ${highlighted ? 'text-[#e57373]' : 'text-primary'}`}
        >
          {actionText}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
            <path 
              d="M6 12L10 8L6 4" 
              stroke={highlighted ? '#e57373' : '#00AFB9'} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </Card>
  );
};

export default Index;
