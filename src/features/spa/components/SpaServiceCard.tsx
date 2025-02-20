
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { SpaService } from '../types';

interface SpaServiceCardProps {
  service: SpaService;
  onBook: (serviceId: string) => void;
}

const SpaServiceCard = ({ service, onBook }: SpaServiceCardProps) => {
  return (
    <Card className="w-full snap-center animate-fade-in">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <img 
          src={service.image} 
          alt={service.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`
            px-2 py-1 rounded-full text-xs
            ${service.availability === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
          `}>
            {service.availability}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-secondary">{service.name}</h3>
          <span className="text-primary font-semibold">${service.price}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Clock className="w-4 h-4" />
          {service.duration}
        </div>
        <p className="text-sm text-gray-600 mb-4">{service.description}</p>
        <Button 
          onClick={() => onBook(service.id)}
          className="w-full bg-primary hover:bg-primary-dark"
          disabled={service.availability === 'booked'}
        >
          Book Now
        </Button>
      </div>
    </Card>
  );
};

export default SpaServiceCard;
