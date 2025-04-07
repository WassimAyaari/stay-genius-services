
import React from 'react';
import { UtensilsCrossed, Heart, Phone, Info } from 'lucide-react';
import ServiceCard from './ServiceCard';
import { useLocation } from 'react-router-dom';

const MainServicesSection = () => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');
  
  return (
    <section className="px-6 mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-secondary">Main Services</h2>
        {/* Admin button to edit About page */}
        {!isAdmin}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ServiceCard 
          icon={<Info className="w-6 h-6 text-primary" />} 
          title="About Us" 
          description="Learn more about our hotel" 
          actionText="View All" 
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
