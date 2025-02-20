
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ActivityCard from './ActivityCard';
import { Activity } from '../types';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ActivitiesSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [participants, setParticipants] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      return data as Activity[];
    }
  });

  const bookActivityMutation = useMutation({
    mutationFn: async ({ 
      activityId, 
      participants, 
      specialRequests 
    }: { 
      activityId: string; 
      participants: number; 
      specialRequests: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('activity_bookings')
        .insert({
          activity_id: activityId,
          user_id: user.id,
          participants,
          special_requests: specialRequests,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      const activity = activities?.find(a => a.id === variables.activityId);
      toast({
        title: "Success",
        description: `Successfully booked ${activity?.name}!`,
      });
      setSelectedActivity(null);
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  });

  const handleBookActivity = async (activityId: string) => {
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

    setSelectedActivity(activity);
  };

  const handleConfirmBooking = () => {
    if (!selectedActivity) return;

    bookActivityMutation.mutate({
      activityId: selectedActivity.id,
      participants,
      specialRequests,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse text-gray-400">Loading activities...</div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities?.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onBook={handleBookActivity}
          />
        ))}
      </div>

      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book {selectedActivity?.name}</DialogTitle>
            <DialogDescription>
              Please provide the following details to complete your booking.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="participants" className="text-sm font-medium">
                Number of Participants
              </label>
              <Input
                id="participants"
                type="number"
                min={1}
                max={selectedActivity?.capacity || 1}
                value={participants}
                onChange={(e) => setParticipants(parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="special-requests" className="text-sm font-medium">
                Special Requests
              </label>
              <Textarea
                id="special-requests"
                placeholder="Any special requirements or requests..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setSelectedActivity(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmBooking} disabled={bookActivityMutation.isPending}>
              {bookActivityMutation.isPending ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActivitiesSection;
