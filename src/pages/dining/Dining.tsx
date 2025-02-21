
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Clock } from 'lucide-react';
import Layout from '@/components/Layout';

const Dining = () => {
  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-secondary mb-4">Dining Experiences</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover culinary excellence at our restaurants, where every meal becomes a memorable experience
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Restaurant Card */}
        <Card className="overflow-hidden animate-fade-in">
          <img 
            src="/placeholder.svg"
            alt="Restaurant"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-semibold text-secondary mb-2">Ocean View Restaurant</h3>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
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
      </div>
    </Layout>
  );
};

export default Dining;
