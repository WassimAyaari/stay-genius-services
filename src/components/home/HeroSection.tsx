
import React, { useState, useEffect } from 'react';
import HeroSearchBar from './HeroSearchBar';
import HeroSearchDialog from './HeroSearchDialog';

const HeroSection = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Log component rendering
  console.log("HeroSection rendering with search dialog open:", open);

  useEffect(() => {
    // Close search with Escape key
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

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
      <HeroSearchBar 
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        placeholder="Search for services, activities, or amenities..."
      />

      {/* Search Dialog */}
      <HeroSearchDialog 
        open={open}
        setOpen={setOpen}
        query={query}
        setQuery={setQuery}
      />
    </section>
  );
};

export default HeroSection;
