
import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { supabase } from '@/integrations/supabase/client';
import ActivityCard from './ActivityCard';
import { Activity } from '../types';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      image: '/placeholder.svg',
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
      image: '/placeholder.svg',
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
      image: '/placeholder.svg',
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
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-secondary">Activities</h2>
        <Link to="/activities">
          <Button variant="ghost" className="text-primary flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      
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
    </div>
  );
};

export default ActivitiesSection;
