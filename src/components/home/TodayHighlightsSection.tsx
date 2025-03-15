
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Wine } from 'lucide-react';

const TodayHighlightsSection = () => {
  return (
    <section className="px-6 mb-10">
      <h2 className="text-2xl font-bold text-secondary mb-4">Today's Highlights</h2>
      <div className="grid grid-cols-1 gap-4">
        <Card className="overflow-hidden">
          <div className="flex items-center">
            <div className="relative w-1/3 h-32">
              <img 
                src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Wine Tasting" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex-1">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Wine className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-secondary">Wine Tasting</h3>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Today</span>
              </div>
              <p className="text-gray-600 text-sm mb-2">Today at 6 PM - Wine Cellar</p>
              <Link to="/activities">
                <Button size="sm" className="w-full sm:w-auto">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center">
            <div className="relative w-1/3 h-32">
              <img 
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Chef's Special Dinner" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex-1">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-secondary">Chef's Special Dinner</h3>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Tonight</span>
              </div>
              <p className="text-gray-600 text-sm mb-2">Tonight at 7 PM - Main Restaurant</p>
              <Link to="/dining">
                <Button size="sm" className="w-full sm:w-auto">
                  Reserve
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default TodayHighlightsSection;
