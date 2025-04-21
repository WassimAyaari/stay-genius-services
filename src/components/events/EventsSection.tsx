
import React from 'react';
import { EventBookingCard } from './EventBookingCard';
import { Event } from '@/types/event';

interface EventsSectionProps {
  events: Event[];
}

export const EventsSection = ({ events }: EventsSectionProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun événement à venir
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <EventBookingCard key={event.id} event={event} />
      ))}
    </div>
  );
};
