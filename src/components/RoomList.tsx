
import React from 'react';
import RoomCard from './RoomCard';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { ChevronRight } from 'lucide-react';

const RoomList = () => {
  const rooms = [
    {
      id: '1',
      name: 'Deluxe Ocean View',
      price: 299,
      capacity: 2,
      size: '45m²',
      image: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Premium Suite',
      price: 499,
      capacity: 4,
      size: '65m²',
      image: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Family Room',
      price: 399,
      capacity: 3,
      size: '55m²',
      image: '/placeholder.svg'
    }
  ];

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
  );
};

export default RoomList;
