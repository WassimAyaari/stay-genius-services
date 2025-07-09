
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { SpaService } from '../types';

interface SpaServiceCardProps {
  service: SpaService;
  onBook: () => void;
}

const SpaServiceCard = ({
  service,
  onBook
}: SpaServiceCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 bg-gray-200">
        <img 
          src={service.image || "/lovable-uploads/57f94ab0-9957-4a75-9529-ecdad2e93b0b.png"} 
          alt={service.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">{service.name}</h3>
          <span className="text-primary font-semibold">${service.price}</span>
        </div>
        {service.duration && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
            <Clock className="h-3 w-3" />
            <span>{service.duration}</span>
          </div>
        )}
        <Button 
          onClick={onBook}
          size="sm" 
          className="w-full mt-2"
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default SpaServiceCard;
