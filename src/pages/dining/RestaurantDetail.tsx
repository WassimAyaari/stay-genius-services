import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Clock, MapPin, Calendar, BookText } from 'lucide-react';
import Layout from '@/components/Layout';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { EventsSection } from '@/components/events/EventsSection';
import { useEvents } from '@/hooks/useEvents';

const RestaurantDetail = () => {
  const { id } = useParams();
  const restaurantId = id as string;
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { restaurant, isLoading } = useRestaurants(restaurantId);
  const { upcomingEvents } = useEvents();
  const [openBooking, setOpenBooking] = useState(false);

  useEffect(() => {
    if (location.state?.openBooking) {
      setOpenBooking(true);
    }
  }, [location.state]);

  const handleBookTable = () => {
    toast({
      title: "Success",
      description: "Table reserved successfully!",
    });
  };

  const restaurantEvents = upcomingEvents?.filter(
    event => event.restaurant_id === restaurantId
  ) || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-gray-400">Loading restaurant details...</div>
          </div>
        ) : !restaurant ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-400">Restaurant not found.</div>
          </div>
        ) : (
          <>
            <section className="mb-8">
              <Card className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2 relative">
                    <Carousel
                      opts={{
                        loop: true,
                      }}
                      className="w-full"
                    >
                      <CarouselContent className="w-full">
                        {restaurant.images.map((image, index) => (
                          <CarouselItem key={index} className="w-full">
                            <img
                              src={image}
                              alt={`${restaurant.name} - Image ${index + 1}`}
                              className="w-full h-96 object-cover"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="hidden sm:flex" />
                      <CarouselNext className="hidden sm:flex" />
                    </Carousel>
                  </div>
                  <div className="p-6 md:w-1/2">
                    <h1 className="text-3xl font-semibold text-secondary mb-4">{restaurant.name}</h1>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <UtensilsCrossed className="w-4 h-4" />
                      <span>{restaurant.cuisine}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Clock className="w-4 h-4" />
                      <span>{restaurant.openHours}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurant.location}</span>
                    </div>
                    <p className="text-gray-600 mb-6">{restaurant.description}</p>
                    <Button onClick={handleBookTable}>
                      {restaurant.actionText || "Book a Table"}
                    </Button>
                  </div>
                </div>
              </Card>
            </section>

            {/* Add Events Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-secondary mb-6">
                Événements à venir
              </h2>
              <EventsSection events={restaurantEvents} />
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary mb-6">Reviews</h2>
              <Card className="p-6">
                <p className="text-gray-600">No reviews yet.</p>
              </Card>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
};

export default RestaurantDetail;
