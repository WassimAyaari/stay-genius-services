
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { supabase } from '@/integrations/supabase/client';
import ActivityCard from './ActivityCard';
import { Activity } from '../types';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight } from 'lucide-react';

const ActivitiesSection = () => {
  const { toast } = useToast();

  const activities: Activity[] = [
    {
      id: '1',
      name: 'Wine Tasting',
      description: 'Experience the finest wines',
      date: '2024-03-15',
      time: '18:00',
      duration: '2 hours',
      location: 'Wine Cellar',
      price: 75,
      capacity: 12,
      image: '/lovable-uploads/044dc763-e0b0-462e-8c6e-788f35efcd0c.png',
      category: 'entertainment',
      status: 'upcoming'
    },
    {
      id: '2',
      name: 'Yoga Class',
      description: 'Morning yoga session',
      date: '2024-03-16',
      time: '08:00',
      duration: '1 hour',
      location: 'Wellness Center',
      price: 25,
      capacity: 15,
      image: '/lovable-uploads/b0b89a1c-2c12-444b-be2c-1a65b9884f18.png',
      category: 'fitness',
      status: 'upcoming'
    },
    {
      id: '3',
      name: 'Cooking Class',
      description: 'Learn to cook local cuisine',
      date: '2024-03-16',
      time: '14:00',
      duration: '3 hours',
      location: 'Main Kitchen',
      price: 95,
      capacity: 8,
      image: '/lovable-uploads/298d1ba4-d372-413d-9386-a531958ccd9c.png',
      category: 'culture',
      status: 'upcoming'
    }
  ];

  const handleBookActivity = async (activityId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to book an activity');

      toast({
        title: "Success",
        description: "Activity booked successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

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
        {activities.map((activity) => (
          <CarouselItem key={activity.id} className="md:basis-2/5 lg:basis-[30%] pl-4">
            <div className="px-2">
              <ActivityCard
                activity={activity}
                onBook={handleBookActivity}
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

export default ActivitiesSection;
