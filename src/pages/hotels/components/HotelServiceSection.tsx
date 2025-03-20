
import React from 'react';
import { Button } from '@/components/ui/button';
import { HotelService } from '@/lib/types';

interface HotelServiceSectionProps {
  services: HotelService[];
  title: string;
  bgColor?: string;
}

const HotelServiceSection = ({ services, title, bgColor = "bg-white" }: HotelServiceSectionProps) => {
  if (services.length === 0) return null;

  return (
    <div className={`py-10 px-4 md:px-8 ${bgColor}`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(service => (
            <div key={service.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <Button asChild variant="outline" size="sm">
                <a href={service.action_link}>{service.action_text}</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelServiceSection;
