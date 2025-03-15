
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FeaturedExperienceSection = () => {
  return (
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
  );
};

export default FeaturedExperienceSection;
