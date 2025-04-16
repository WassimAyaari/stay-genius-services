
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EventCalendarDialog from '@/components/events/EventCalendarDialog';
import { useEvents } from '@/hooks/useEvents';

export const EventHeader = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { upcomingEvents } = useEvents();

  return (
    <div className="mb-10">
      <Card className="p-6 rounded-xl">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-1">View all upcoming events</h3>
          <p className="text-gray-600">Plan your stay with our event calendar</p>
        </div>
        <Button className="w-full gap-2" onClick={() => setIsCalendarOpen(true)}>
          <Calendar className="h-4 w-4" />
          Open Calendar
        </Button>
      </Card>

      <EventCalendarDialog 
        isOpen={isCalendarOpen}
        onOpenChange={setIsCalendarOpen}
        events={upcomingEvents}
      />
    </div>
  );
};
