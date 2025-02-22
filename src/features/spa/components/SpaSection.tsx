
import React, { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import SpaServiceCard from './SpaServiceCard';
import { SpaService } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight } from 'lucide-react';
import SwipeIndicator from '@/components/ui/swipe-indicator';
import useEmblaCarousel from 'embla-carousel-react';

const SpaSection = () => {
  const { toast } = useToast();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const spaServices: SpaService[] = [
    {
      id: '1',
      name: 'Swedish Massage',
      description: '60-minute relaxing massage',
      price: 120,
      duration: '60 min',
      image: '/placeholder.svg',
      category: 'massage',
      availability: 'available'
    },
    {
      id: '2',
      name: 'Deep Tissue Massage',
      description: 'Therapeutic deep tissue treatment',
      price: 140,
      duration: '60 min',
      image: '/placeholder.svg',
      category: 'massage',
      availability: 'available'
    },
    {
      id: '3',
      name: 'Aromatherapy',
      description: 'Essential oils massage therapy',
      price: 130,
      duration: '60 min',
      image: '/placeholder.svg',
      category: 'wellness',
      availability: 'available'
    }
  ];

  const handleBookService = async (serviceId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to book a spa service');

      toast({
        title: "Success",
        description: "Spa service booked successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  React.useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  return (
    <div>
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
        <CarouselContent ref={emblaRef} className="-ml-4">
          {spaServices.map((service) => (
            <CarouselItem key={service.id} className="md:basis-2/5 lg:basis-[30%] pl-4">
              <div className="px-2">
                <SpaServiceCard service={service} onBook={handleBookService} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
      <SwipeIndicator selectedIndex={selectedIndex} totalSlides={spaServices.length} />
    </div>
  );
};

export default SpaSection;
