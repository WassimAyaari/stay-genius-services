
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const HeroSection = () => {
  return (
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
  );
};

export default HeroSection;
