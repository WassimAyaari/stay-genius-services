import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import RestaurantCard from './RestaurantCard';
import { Restaurant } from '../types';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ChevronRight } from 'lucide-react';

const DiningSection = () => {
  const { toast } = useToast();

  const { data: restaurants, isLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      return [
        {
          id: '1',
          name: 'The Grand Bistro',
          description: 'Experience fine dining with a modern twist',
          cuisine: 'International',
          images: ['/lovable-uploads/298d1ba4-d372-413d-9386-a531958ccd9c.png'],
          openHours: '7:00 AM - 11:00 PM',
          location: 'Ground Floor',
          status: 'open' as const
        },
        {
          id: '2',
          name: 'Sakura Japanese',
          description: 'Authentic Japanese cuisine and sushi',
          cuisine: 'Japanese',
          images: ['/lovable-uploads/044dc763-e0b0-462e-8c6e-788f35efcd0c.png'],
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
      <div className="relative w-full">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/50 animate-pulse hidden md:block">
          <ChevronRight className="w-6 h-6" />
        </div>
      </div>
      <CarouselContent className="-ml-4">
        {restaurants?.map((restaurant) => (
          <CarouselItem key={restaurant.id} className="md:basis-2/5 lg:basis-[30%] pl-4">
            <div className="px-2">
              <RestaurantCard
                restaurant={restaurant}
                onBookTable={handleBookTable}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
};

export default DiningSection;
