
import React, { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import SpaServiceCard from './SpaServiceCard';
import { useSpaServices } from '@/hooks/useSpaServices';
import { ChevronRight } from 'lucide-react';
import SwipeIndicator from '@/components/ui/swipe-indicator';
import useEmblaCarousel from 'embla-carousel-react';

interface SpaSectionProps {
  onBookService: (serviceId: string) => void;
}

const SpaSection = ({ onBookService }: SpaSectionProps) => {
  const { services, isLoading } = useSpaServices();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  React.useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  if (isLoading) {
    return <div className="text-center py-8">Chargement des services...</div>;
  }

  const displayServices = services?.slice(0, 6) || [];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Nos Services</h2>
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
          {displayServices.map((service) => (
            <CarouselItem key={service.id} className="md:basis-2/5 lg:basis-[30%] pl-4">
              <div className="px-2">
                <SpaServiceCard service={service} onBook={() => onBookService(service.id)} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
      <SwipeIndicator selectedIndex={selectedIndex} totalSlides={displayServices.length} />
    </div>
  );
};

export default SpaSection;
