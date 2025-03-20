
import React from 'react';
import { Button } from '@/components/ui/button';
import { HotelEvent } from '@/lib/types';

interface HotelEventsSectionProps {
  events: HotelEvent[];
}

const HotelEventsSection = ({ events }: HotelEventsSectionProps) => {
  if (events.length === 0) return null;

  return (
    <div className="py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Événements à venir</h2>
        <div className="space-y-4">
          {events.slice(0, 3).map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row overflow-hidden">
              <div 
                className="md:w-1/4 h-48 md:h-auto bg-cover bg-center" 
                style={{ backgroundImage: `url(${event.image})` }}
              ></div>
              <div className="p-4 md:w-3/4">
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
                  <span>{event.date}</span>
                  <span>{event.time}</span>
                  <span>{event.location}</span>
                </div>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <Button asChild variant="outline">
                  <a href={event.action_link}>{event.action_text}</a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelEventsSection;
