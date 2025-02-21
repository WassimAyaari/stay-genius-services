
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import RestaurantCard from './RestaurantCard';
import { Restaurant } from '../types';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const DiningSection = () => {
  const { toast } = useToast();

  const { data: restaurants, isLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      // This would typically fetch from your database
      // For now, returning mock data
      return [
        {
          id: '1',
          name: 'The Grand Bistro',
          description: 'Experience fine dining with a modern twist',
          cuisine: 'International',
          images: ['/placeholder.svg'],
          openHours: '7:00 AM - 11:00 PM',
          location: 'Ground Floor',
          status: 'open' as const
        },
        {
          id: '2',
          name: 'Sakura Japanese',
          description: 'Authentic Japanese cuisine and sushi',
          cuisine: 'Japanese',
          images: ['/placeholder.svg'],
          openHours: '12:00 PM - 10:00 PM',
          location: 'Level 2',
          status: 'open' as const
        }
      ];
    }
  });

  const handleBookTable = async (restaurantId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to book a table');

      // TODO: Add booking logic here
      toast({
        title: "Success",
        description: "Table reserved successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse text-gray-400">Loading restaurants...</div>
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {restaurants?.map((restaurant) => (
          <CarouselItem key={restaurant.id} className="md:basis-1/2 lg:basis-1/2">
            <RestaurantCard
              restaurant={restaurant}
              onBookTable={handleBookTable}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
};

export default DiningSection;
