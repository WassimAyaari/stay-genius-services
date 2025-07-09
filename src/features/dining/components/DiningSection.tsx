
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import RestaurantCard from './RestaurantCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ChevronRight } from 'lucide-react';
import { useRestaurants } from '@/hooks/useRestaurants';
import { supabase } from '@/integrations/supabase/client';

const DiningSection = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { featuredRestaurants, isFeaturedLoading } = useRestaurants();

  const handleBookTable = async (restaurantId: string) => {
    // Navigate to restaurant detail page with booking dialog open
    window.location.href = `/dining/${restaurantId}?openBooking=true`;
  };

  if (isFeaturedLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse text-gray-400">{t('dining.featuredRestaurants')}</div>
      </div>
    );
  }

  if (!featuredRestaurants || featuredRestaurants.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-400">{t('dining.noFeaturedRestaurants')}</div>
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
        {featuredRestaurants?.map((restaurant) => (
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
