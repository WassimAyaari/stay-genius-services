
import React from 'react';
import { Button } from '@/components/ui/button';
import { HotelExperience } from '@/lib/types';

interface HotelExperienceSectionProps {
  experiences: HotelExperience[];
}

const HotelExperienceSection = ({ experiences }: HotelExperienceSectionProps) => {
  if (experiences.length === 0) return null;

  return (
    <div className="py-10 bg-gray-50 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Expériences à découvrir</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.slice(0, 2).map(experience => (
            <div key={experience.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div 
                className="h-48 bg-cover bg-center" 
                style={{ backgroundImage: `url(${experience.image})` }}
              ></div>
              <div className="p-6">
                <span className="text-sm text-primary font-medium">{experience.category}</span>
                <h3 className="text-xl font-bold mt-1 mb-2">{experience.title}</h3>
                <p className="text-gray-600 mb-4">{experience.description}</p>
                <Button asChild>
                  <a href={experience.action_link}>{experience.action_text}</a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelExperienceSection;
