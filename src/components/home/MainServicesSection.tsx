
import React from 'react';
import { UtensilsCrossed, Heart, Info, Phone } from 'lucide-react';
import ServiceCard from './ServiceCard';

const MainServicesSection = () => {
  return (
    <section className="px-6 mb-10">
      <h2 className="text-2xl font-bold text-secondary mb-4">Main Services</h2>
      <div className="grid grid-cols-2 gap-4">
        <ServiceCard 
          icon={<Info className="w-6 h-6 text-primary" />}
          title="About Us"
          description="Hotel directory and information"
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
          icon={<Phone className="w-6 h-6 text-primary" />}
          title="Concierge"
          description="24/7 assistance services"
          actionText="Contact Now"
          actionLink="/services"
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
  );
};

export default MainServicesSection;
