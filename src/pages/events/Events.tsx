
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from "@/lib/utils";

const Events = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  
  const events = [
    {
      id: 1,
      title: "Wine Tasting Evening",
      date: "March 20, 2025",
      time: "6:00 PM - 9:00 PM",
      location: "Wine Cellar",
      description: "Join our sommelier for an exclusive wine tasting event featuring premium selections from around the world.",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "event"
    },
    {
      id: 2,
      title: "Chef's Special Dinner",
      date: "March 22, 2025",
      time: "7:00 PM - 10:00 PM",
      location: "Main Restaurant",
      description: "Experience a culinary journey with our executive chef's special tasting menu featuring seasonal ingredients.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "event"
    },
    {
      id: 3,
      title: "Spring Spa Package",
      date: "Valid until April 30",
      time: "10:00 AM - 8:00 PM",
      location: "Hotel Spa",
      description: "Enjoy 20% off on our signature spa treatments. Package includes a 60-minute massage and facial.",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "promo"
    },
    {
      id: 4,
      title: "Extended Stay Discount",
      date: "Book by May 15",
      time: "Any time",
      location: "Hotel Genius",
      description: "Book 5 nights and get 15% off your entire stay, plus complimentary breakfast and spa access.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "promo"
    },
    {
      id: 5,
      title: "Cocktail Masterclass",
      date: "Every Friday",
      time: "8:00 PM - 10:00 PM",
      location: "The Bar",
      description: "Learn how to make signature cocktails with our expert mixologists. Includes tastings and recipe cards.",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      category: "event"
    },
    {
      id: 6,
      title: "Weekend Package",
      date: "Every weekend",
      time: "Check-in Friday",
      location: "Reception",
      description: "Book our weekend package and enjoy special amenities including spa credits and dining discounts.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "promo"
    }
  ];

  // States for tracking viewed stories
  const [viewedStories, setViewedStories] = useState<number[]>([]);
  
  const markAsSeen = (id: number) => {
    if (!viewedStories.includes(id)) {
      setViewedStories([...viewedStories, id]);
    }
    setActiveStoryIndex(events.findIndex(event => event.id === id));
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [events.length]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Stories Navigation Bar */}
        <div className="mb-8">
          <ScrollArea className="w-full pb-4">
            <div className="flex space-x-4 pb-2">
              {events.map((story, index) => (
                <button 
                  key={story.id} 
                  className="flex flex-col items-center space-y-1"
                  onClick={() => markAsSeen(story.id)}
                >
                  <div className={cn(
                    "p-1 rounded-full", 
                    viewedStories.includes(story.id) 
                      ? "bg-gray-300" 
                      : "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500"
                  )}>
                    <div className="p-0.5 bg-white rounded-full">
                      <Avatar className={cn(
                        "h-16 w-16 transition-all",
                        activeStoryIndex === index ? "ring-2 ring-primary" : ""
                      )}>
                        <AvatarImage src={story.image} alt={story.title} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {story.title.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <span className="text-xs text-center w-16 truncate">{story.title}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Story Viewer */}
        <div className="mb-12">
          <Carousel
            className="w-full"
            setApi={(api) => {
              if (api) {
                api.on("select", () => {
                  const currentIndex = api.selectedScrollSnap();
                  setSelectedIndex(currentIndex);
                  setActiveStoryIndex(currentIndex);
                  markAsSeen(events[currentIndex].id);
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
                      <Button size="sm">Learn More</Button>
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

        {/* Upcoming Events */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-6">Upcoming Events</h2>
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
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        <span>Limited Spots Available</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="flex gap-3">
                      <Button>Book Now</Button>
                      <Button variant="outline">Add to Calendar</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Special Promotions */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-6">Special Promotions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.filter(event => event.category === 'promo').map(promo => (
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
                    <span>{promo.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{promo.description}</p>
                  <Button className="w-full">View Details</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Event Calendar */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-6">Event Calendar</h2>
          <Card className="p-6 rounded-xl">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-1">View All Upcoming Events</h3>
              <p className="text-gray-600">Plan your stay with our event calendar</p>
            </div>
            <Button className="w-full gap-2">
              <Calendar className="h-4 w-4" />
              Open Full Calendar
            </Button>
          </Card>
        </div>

        {/* Subscribe Section */}
        <div className="mb-8">
          <Card className="p-6 rounded-xl bg-primary/5">
            <h3 className="text-xl font-semibold mb-2 text-center">Stay Updated</h3>
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
    </Layout>
  );
};

export default Events;
