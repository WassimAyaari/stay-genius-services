
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ActivityCard from './ActivityCard';
import { Activity } from '../types';
import { useToast } from '@/hooks/use-toast';
import { CarouselItem } from '@/components/ui/carousel';

const ActivitiesSection = () => {
  const { toast } = useToast();

  const activities = [
    {
      id: '1',
      name: 'Wine Tasting',
      description: 'Experience the finest wines',
      date: '2024-03-15',
      time: '18:00',
      location: 'Wine Cellar',
      price: '$75',
      capacity: 12,
      image: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Yoga Class',
      description: 'Morning yoga session',
      date: '2024-03-16',
      time: '08:00',
      location: 'Wellness Center',
      price: '$25',
      capacity: 15,
      image: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Cooking Class',
      description: 'Learn to cook local cuisine',
      date: '2024-03-16',
      time: '14:00',
      location: 'Main Kitchen',
      price: '$95',
      capacity: 8,
      image: '/placeholder.svg'
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
    <>
      {activities.map((activity) => (
        <CarouselItem key={activity.id} className="md:basis-1/2 lg:basis-1/3">
          <ActivityCard
            activity={activity}
            onBook={handleBookActivity}
          />
        </CarouselItem>
      ))}
    </>
  );
};

export default ActivitiesSection;
