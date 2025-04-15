
import React from 'react';
import { Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const EventHeader = () => (
  <div className="mb-10">
    <Card className="p-6 rounded-xl">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-1">View all upcoming events</h3>
        <p className="text-gray-600">Plan your stay with our event calendar</p>
      </div>
      <Button className="w-full gap-2">
        <Calendar className="h-4 w-4" />
        Open Calendar
      </Button>
    </Card>
  </div>
);

