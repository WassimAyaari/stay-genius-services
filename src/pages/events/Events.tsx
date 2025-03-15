
import React from 'react';
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

const Events = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
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
    }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [events.length]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Featured Carousel */}
        <div className="mb-12">
          <Carousel
            className="w-full"
            // Fix the type error by adding a proper onSelect handler
            // that updates selectedIndex with the value coming from the carousel
            onSelect={(index) => setSelectedIndex(index)}
          >
            <CarouselContent>
              {events.map((event, index) => (
                <CarouselItem key={event.id}>
                  <div className="relative rounded-3xl overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-64 object-cover"
                    />
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
