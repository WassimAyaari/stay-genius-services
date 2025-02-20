
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Clock } from 'lucide-react';

const Dining = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold text-secondary mb-4">Dining Experiences</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover culinary excellence at our restaurants, where every meal becomes a memorable experience
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Restaurant Card */}
        <Card className="overflow-hidden animate-fade-in">
          <img 
            src="/placeholder.svg"
            alt="Restaurant"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold text-secondary mb-2">Ocean View Restaurant</h3>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <UtensilsCrossed className="w-4 h-4" />
              <span>International Cuisine</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <Clock className="w-4 h-4" />
              <span>7:00 AM - 11:00 PM</span>
            </div>
            <Button className="w-full">Reserve a Table</Button>
          </div>
        </Card>

        {/* More restaurant cards would go here */}
      </div>
    </div>
  );
};

export default Dining;
