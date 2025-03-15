
import React from 'react';
import { ShoppingBag, Map, Compass, Star } from 'lucide-react';
import ServiceCard from './ServiceCard';

const AdditionalServicesSection = () => {
  return (
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

        <ServiceCard 
          icon={<Compass className="w-6 h-6 text-primary" />}
          title="Destination"
          description="Things to do nearby"
          actionText="Explore"
          actionLink="/destination"
          status="Available"
        />
        
        <ServiceCard 
          icon={<Star className="w-6 h-6 text-primary" />}
          title="Feedback"
          description="Share your experience"
          actionText="Write Review"
          actionLink="/feedback"
          status="Available"
        />
      </div>
    </section>
  );
};

export default AdditionalServicesSection;
