
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ActivityCard from './ActivityCard';
import { Activity } from '../types';
import { useToast } from '@/hooks/use-toast';

const ActivitiesSection = () => {
  const { toast } = useToast();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Mock data for now - would typically fetch from Supabase
      return [
        {
          id: '1',
          name: 'Morning Yoga',
          description: 'Start your day with energizing yoga session',
          date: '2024-03-20',
          time: '07:00 AM',
          duration: '60 minutes',
          location: 'Wellness Center',
          capacity: 15,
          price: 25,
          image: '/placeholder.svg',
          category: 'fitness' as const,
          status: 'upcoming' as const
        },
        {
          id: '2',
          name: 'Wine Tasting',
          description: 'Experience premium wines with our sommelier',
          date: '2024-03-20',
          time: '18:00 PM',
          duration: '90 minutes',
          location: 'Wine Cellar',
          capacity: 10,
          price: 75,
          image: '/placeholder.svg',
          category: 'entertainment' as const,
          status: 'upcoming' as const
        }
      ];
    }
  });

  const handleBookActivity = async (activityId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please sign in to book an activity",
        });
        return;
      }

      const activity = activities?.find(a => a.id === activityId);
      if (!activity) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Activity not found",
        });
        return;
      }

      // Here we would typically insert the booking into Supabase
      // For now, just show a success toast
      toast({
        title: "Success",
        description: `Successfully booked ${activity.name}!`,
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
        <div className="animate-pulse text-gray-400">Loading activities...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {activities?.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onBook={handleBookActivity}
        />
      ))}
    </div>
  );
};

export default ActivitiesSection;
