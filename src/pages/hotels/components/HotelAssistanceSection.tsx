
import React from 'react';
import { Button } from '@/components/ui/button';
import { HotelAssistance } from '@/lib/types';

interface HotelAssistanceSectionProps {
  assistance: HotelAssistance | null;
}

const HotelAssistanceSection = ({ assistance }: HotelAssistanceSectionProps) => {
  if (!assistance) return null;

  return (
    <div 
      className="py-10 px-4 md:px-8 bg-cover bg-center" 
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${assistance.background_image})` }}
    >
      <div className="max-w-2xl mx-auto text-center text-white">
        <h2 className="text-3xl font-bold mb-4">{assistance.title}</h2>
        <p className="text-xl mb-6">{assistance.description}</p>
        <Button asChild size="lg" variant="secondary">
          <a href={assistance.action_link}>{assistance.action_text}</a>
        </Button>
      </div>
    </div>
  );
};

export default HotelAssistanceSection;
