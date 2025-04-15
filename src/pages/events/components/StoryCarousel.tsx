
import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { Event } from '@/types/event';
import { format } from 'date-fns';
import SwipeIndicator from '@/components/ui/swipe-indicator';

interface StoryCarouselProps {
  events: Event[];
  loading: boolean;
  onBookEvent: (event: Event) => void;
}

export const StoryCarousel = ({ events, loading, onBookEvent }: StoryCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!loading && events.length > 0) {
      const interval = setInterval(() => {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % events.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [loading, events.length]);

  if (loading) {
    return (
      <div className="h-[70vh] rounded-3xl bg-gray-100 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="h-[50vh] rounded-3xl bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No events available</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
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
          {events.map((event) => (
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
                        className={`h-1 flex-1 rounded-full ${i === selectedIndex ? 'bg-white' : 'bg-white/30'}`}
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
                  <Button size="sm" onClick={() => onBookEvent(event)}>
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
      <SwipeIndicator selectedIndex={selectedIndex} totalSlides={events.length} />
    </div>
  );
};
