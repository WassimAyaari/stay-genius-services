
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';

const Activities = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-secondary mb-4">Things To Do</h1>
        <p className="text-gray-600">Discover activities and experiences</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button variant="default" className="bg-primary">All Activities</Button>
        <Button variant="outline">On-Site Activities</Button>
        <Button variant="outline">Local Attractions</Button>
        <Button variant="outline">Guided Tours</Button>
        <Button variant="outline">Special Events</Button>
      </div>

      {/* Activities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <div className="aspect-video relative">
            <img 
              src="public/lovable-uploads/044dc763-e0b0-462e-8c6e-788f35efcd0c.png"
              alt="Treasure Hunt"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">Treasure Hunt Adventure</h3>
            <p className="text-gray-600 mb-4">
              An exciting treasure hunt around the hotel grounds
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Duration: 1.5 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Time: 10:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Location: Hotel Garden</span>
              </div>
            </div>
            <Button className="w-full">Book Activity</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Activities;
