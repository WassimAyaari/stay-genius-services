
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Heart, Share } from 'lucide-react';
import { Event } from '@/types/event';
import { format } from 'date-fns';

interface EventListProps {
  events: Event[];
  loading: boolean;
  onBookEvent: (event: Event) => void;
}

export const EventList = ({ events, loading, onBookEvent }: EventListProps) => {
  if (loading) {
    return <div className="h-48 rounded-lg bg-gray-100 animate-pulse"></div>;
  }

  if (events.length === 0) {
    return (
      <Card className="p-4 text-center">
        <p className="text-gray-500">No upcoming events</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {events.filter(event => event.category === 'event').map(event => (
        <Card key={event.id} className="overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 h-48 md:h-auto relative">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-white/80">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-white/80">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 md:w-2/3">
              <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span>{format(new Date(event.date), 'dd MMMM yyyy')}</span>
                </div>
                {event.time && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <span>{event.location}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  <span>Limited spots</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="flex gap-3">
                <Button onClick={() => onBookEvent(event)}>Book</Button>
                <Button variant="outline">Add to Calendar</Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
