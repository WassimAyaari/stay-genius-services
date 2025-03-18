
import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi
} from '@/components/ui/carousel';
import SwipeIndicator from '@/components/ui/swipe-indicator';
import ExperienceCard from '@/components/RoomCard';
import { Card } from '@/components/ui/card';

const experiences = [
  {
    id: 1,
    title: 'Wine Tasting',
    description: 'Learn about local wines with our sommelier',
    imageSrc: '/lovable-uploads/044dc763-e0b0-462e-8c6e-788f35efcd0c.png',
    price: 75, // Changed from string to number
    time: '5:00 PM',
    rating: 4.9
  },
  {
    id: 2,
    title: 'Cooking Class',
    description: 'Learn to cook authentic local cuisine',
    imageSrc: '/lovable-uploads/3cbdcf79-9da5-48bd-90f2-2c1737b76741.png',
    price: 95, // Changed from string to number
    time: '2:00 PM',
    rating: 4.8
  },
  {
    id: 3,
    title: 'Sunset Sailing',
    description: 'Enjoy the beautiful sunset on a sailboat',
    imageSrc: '/lovable-uploads/298d1ba4-d372-413d-9386-a531958ccd9c.png',
    price: 120, // Changed from string to number
    time: '6:30 PM',
    rating: 4.9
  }
];

const FeaturedExperienceSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);

  React.useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-secondary">Featured Experiences</h2>
      </div>

      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent className="-ml-4">
          {experiences.map((experience) => (
            <CarouselItem key={experience.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <ExperienceCard
                id={String(experience.id)}
                name={experience.title}
                image={experience.imageSrc}
                price={experience.price}
                capacity={2}
                size="Standard"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      <div className="flex justify-center mt-4">
        <SwipeIndicator 
          selectedIndex={currentIndex} 
          totalSlides={experiences.length} 
        />
      </div>
    </section>
  );
};

export default FeaturedExperienceSection;
