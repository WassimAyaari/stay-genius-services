
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useEvents } from '@/hooks/useEvents';
import { Event } from '@/types/event';
import EventBookingDialog from '@/components/events/EventBookingDialog';
import { useToast } from '@/hooks/use-toast';
import { EventHeader } from './components/EventHeader';
import { StoryCarousel } from './components/StoryCarousel';
import { EventList } from './components/EventList';
import { PromotionList } from './components/PromotionList';
import { NewsletterSection } from './components/NewsletterSection';
import EventsStories from '@/components/EventsStories';

const Events = () => {
  const { events, loading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { toast } = useToast();

  const handleBookEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsBookingOpen(true);
  };

  const handleReservationSuccess = () => {
    setIsBookingOpen(false);
    toast({
      title: "Reservation confirmed",
      description: "Your reservation has been saved successfully.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4">
        {/* Story Viewer */}
        <div className="mb-6">
          <EventsStories />
        </div>

        {/* Story Carousel */}
        <StoryCarousel 
          events={events}
          loading={loading}
          onBookEvent={handleBookEvent}
        />

        {/* Upcoming Events */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-6">Upcoming Events</h2>
          <EventList 
            events={events}
            loading={loading}
            onBookEvent={handleBookEvent}
          />
        </div>

        {/* Special Promotions */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-6">Special Promotions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PromotionList 
              events={events}
              loading={loading}
              onBookEvent={handleBookEvent}
            />
          </div>
        </div>

        {/* Event Calendar */}
        <EventHeader />

        {/* Subscribe Section */}
        <div className="mb-8">
          <NewsletterSection />
        </div>
      </div>

      {/* Event Booking Dialog */}
      {selectedEvent && (
        <EventBookingDialog
          isOpen={isBookingOpen}
          onOpenChange={setIsBookingOpen}
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.title}
          eventDate={selectedEvent.date}
          onSuccess={handleReservationSuccess}
          maxGuests={selectedEvent.capacity || 10}
        />
      )}
    </Layout>
  );
};

export default Events;
