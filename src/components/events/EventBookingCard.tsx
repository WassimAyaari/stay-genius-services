
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Event } from '@/types/event';
import { format } from 'date-fns';
import EventBookingDialog from './EventBookingDialog';
import { useRequireAuth } from '@/hooks/useRequireAuth';

interface EventBookingCardProps {
  event: Event;
}

export const EventBookingCard = ({ event }: EventBookingCardProps) => {
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);
  const { requireAuth } = useRequireAuth();

  const handleBookEvent = () => {
    requireAuth(() => {
      setIsBookingOpen(true);
    });
  };

  const handleBookingSuccess = () => {
    setIsBookingOpen(false);
  };

  return (
    <Card className="overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3 h-48 md:h-auto relative">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 md:w-2/3">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <span>
                  {event.recurrence_type === 'daily' ? 'Available Daily' :
                   event.recurrence_type === 'weekly' ? 'Available Weekly' :
                   event.recurrence_type === 'monthly' ? 'Available Monthly' :
                   event.date ? format(new Date(event.date), 'dd MMMM yyyy') : 'Date TBD'}
                </span>
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
              {event.capacity && (
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  <span>{event.capacity} spots available</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-600 mb-4">{event.description}</p>
          <Button onClick={handleBookEvent}>
            Book Event
          </Button>
        </div>
      </div>

      <EventBookingDialog
        isOpen={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        eventId={event.id}
        eventTitle={event.title}
        eventDate={event.date}
        onSuccess={handleBookingSuccess}
        maxGuests={event.capacity || 10}
      />
    </Card>
  );
};
