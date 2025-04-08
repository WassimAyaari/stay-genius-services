import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Percent, Ticket, Heart, Share } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SwipeIndicator from '@/components/ui/swipe-indicator';
import EventsStories from '@/components/EventsStories';
import { useEvents } from '@/hooks/useEvents';
import { format } from 'date-fns';
import EventBookingDialog from '@/components/events/EventBookingDialog';
import { useToast } from '@/hooks/use-toast';

const Events = () => {
  const { events, loading } = useEvents();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (!loading && events.length > 0) {
      const interval = setInterval(() => {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % events.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [loading, events.length]);

  const handleBookEvent = (event: any) => {
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
        <div className="mb-6">
          {loading ? (
            <div className="h-[70vh] rounded-3xl bg-gray-100 animate-pulse flex items-center justify-center">
              <p className="text-gray-500">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="h-[50vh] rounded-3xl bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">No events available</p>
            </div>
          ) : (
            <Carousel
              className="w-full"
              setApi={(api) => {
                if (api) {
                  api.on("select", () => {
                    const currentIndex = api.selectedScrollSnap();
                    setSelectedIndex(currentIndex);
                  });
                }
              }}
            >
              <CarouselContent>
                {events.map((event, index) => (
                  <CarouselItem key={event.id}>
                    <div className="relative rounded-3xl overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-[70vh] object-cover"
                      />
                      <div className="absolute top-0 left-0 right-0 p-2">
                        <div className="flex space-x-1">
                          {events.map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-1 flex-1 rounded-full ${i === index ? 'bg-white' : 'bg-white/30'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6 text-white">
                        <span className="text-sm font-medium bg-primary/50 backdrop-blur-sm px-3 py-1 rounded-full mb-2 inline-block">
                          {event.category === 'event' ? 'Event' : 'Promotion'}
                        </span>
                        <h1 className="text-2xl font-bold mb-1">{event.title}</h1>
                        <p className="mb-3">{event.description}</p>
                        <Button size="sm" onClick={() => handleBookEvent(event)}>
                          Book
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </div>
            </Carousel>
          )}
          {!loading && events.length > 0 && (
            <SwipeIndicator selectedIndex={selectedIndex} totalSlides={events.length} />
          )}
        </div>

        {/* Upcoming Events */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-6">Upcoming Events</h2>
          <div className="space-y-6">
            {loading ? (
              <div className="h-48 rounded-lg bg-gray-100 animate-pulse"></div>
            ) : events.filter(event => event.category === 'event').length === 0 ? (
              <Card className="p-4 text-center">
                <p className="text-gray-500">No upcoming events</p>
              </Card>
            ) : (
              events
                .filter(event => event.category === 'event')
                .map(event => (
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
                          <Button onClick={() => handleBookEvent(event)}>Book</Button>
                          <Button variant="outline">Add to Calendar</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
            )}
          </div>
        </div>

        {/* Special Promotions */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-6">Special Promotions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-64 rounded-lg bg-gray-100 animate-pulse"></div>
              ))
            ) : events.filter(event => event.category === 'promo').length === 0 ? (
              <Card className="p-4 text-center col-span-2">
                <p className="text-gray-500">No active promotions</p>
              </Card>
            ) : (
              events
                .filter(event => event.category === 'promo')
                .map(promo => (
                  <Card key={promo.id} className="overflow-hidden">
                    <div className="relative h-40">
                      <img 
                        src={promo.image} 
                        alt={promo.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 left-0 bg-primary text-white text-xs font-bold px-3 py-1 m-3 rounded-full">
                        <Percent className="h-3 w-3 inline mr-1" />
                        Special Offer
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{promo.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span>Valid until {format(new Date(promo.date), 'dd/MM/yyyy')}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{promo.description}</p>
                      <Button className="w-full" onClick={() => handleBookEvent(promo)}>View Details</Button>
                    </div>
                  </Card>
                ))
            )}
          </div>
        </div>

        {/* Event Calendar */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-6">Event Calendar</h2>
          <Card className="p-6 rounded-xl">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-1">View all upcoming events</h3>
              <p className="text-gray-600">Plan your stay with our event calendar</p>
            </div>
            <Button className="w-full gap-2">
              <Calendar className="h-4 w-4" />
              Open Calendar
            </Button>
          </Card>
        </div>

        {/* Subscribe Section */}
        <div className="mb-8">
          <Card className="p-6 rounded-xl bg-primary/5">
            <h3 className="text-xl font-semibold mb-2 text-center">Stay Informed</h3>
            <p className="text-center text-gray-600 mb-4">Subscribe to receive alerts about new events and promotions</p>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button className="gap-2">
                <Ticket className="h-4 w-4" />
                Subscribe
              </Button>
            </div>
          </Card>
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
