
import React, { useState } from 'react';
import RoomCard from './RoomCard';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { ChevronRight } from 'lucide-react';
import SwipeIndicator from './ui/swipe-indicator';
import useEmblaCarousel from 'embla-carousel-react';

const RoomList = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const rooms = [
    {
      id: '1',
      name: 'Deluxe Ocean View',
      price: 299,
      capacity: 2,
      size: '45m²',
      image: '/lovable-uploads/298d1ba4-d372-413d-9386-a531958ccd9c.png'
    },
    {
      id: '2',
      name: 'Premium Suite',
      price: 499,
      capacity: 4,
      size: '65m²',
      image: '/lovable-uploads/3cbdcf79-9da5-48bd-90f2-2c1737b76741.png'
    },
    {
      id: '3',
      name: 'Family Room',
      price: 399,
      capacity: 3,
      size: '55m²',
      image: '/lovable-uploads/ad4ef1bb-ac95-4aaf-87df-6e874d0fcf46.png'
    }
  ];

  React.useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  return (
    <div className="relative">
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
          {rooms.map((room) => (
            <CarouselItem key={room.id} className="md:basis-2/5 lg:basis-[30%] pl-4">
              <div className="px-2">
                <RoomCard {...room} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
      <SwipeIndicator 
        selectedIndex={selectedIndex} 
        totalSlides={rooms.length} 
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
      />
    </div>
  );
};

export default RoomList;
