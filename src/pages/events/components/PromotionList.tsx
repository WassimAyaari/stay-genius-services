
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Percent } from 'lucide-react';
import { Event } from '@/types/event';
import { format } from 'date-fns';

interface PromotionListProps {
  events: Event[];
  loading: boolean;
  onBookEvent: (event: Event) => void;
}

export const PromotionList = ({ events, loading, onBookEvent }: PromotionListProps) => {
  if (loading) {
    return (
      <>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-64 rounded-lg bg-gray-100 animate-pulse"></div>
        ))}
      </>
    );
  }

  const promotions = events.filter(event => event.category === 'promo');

  if (promotions.length === 0) {
    return (
      <Card className="p-4 text-center col-span-2">
        <p className="text-gray-500">No active promotions</p>
      </Card>
    );
  }

  return (
    <>
      {promotions.map(promo => (
        <Card key={promo.id} className="overflow-hidden">
          <div className="relative h-40">
            <img 
              src={promo.image} 
              alt={promo.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 bg-primary text-white text-xs font-bold px-3 py-1 m-3 rounded-full">
              <Percent className="h-3 w-3 inline mr-1" />
              Special Offer
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{promo.title}</h3>
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              <span>Valid until {format(new Date(promo.date), 'dd/MM/yyyy')}</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{promo.description}</p>
            <Button className="w-full" onClick={() => onBookEvent(promo)}>
              View Details
            </Button>
          </div>
        </Card>
      ))}
    </>
  );
};
