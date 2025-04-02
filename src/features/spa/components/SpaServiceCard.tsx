
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { SpaService } from '../types';

interface SpaServiceCardProps {
  service: SpaService;
  onBook: () => void;
}

const SpaServiceCard = ({ service, onBook }: SpaServiceCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 bg-gray-200">
        {service.image ? (
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <img
              src="/lovable-uploads/3cbdcf79-9da5-48bd-90f2-2c1737b76741.png"
              alt="Spa treatment"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">{service.name}</h3>
          <span className="text-primary font-semibold">${service.price}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
          <Clock className="h-3.5 w-3.5" />
          <span>{service.duration}</span>
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {service.description}
        </p>
        <Button 
          onClick={onBook} 
          className="w-full"
          variant="default"
          size="sm"
        >
          Réserver
        </Button>
      </CardContent>
    </Card>
  );
};

export default SpaServiceCard;
