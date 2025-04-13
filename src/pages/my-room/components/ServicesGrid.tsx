
import React from 'react';
import { Room } from '@/hooks/useRoom';
import { useToast } from '@/components/ui/use-toast';
import { FileText } from 'lucide-react';
import CommandSearch from './CommandSearch';
import ServiceCard from './ServiceCard';
import { Service } from '../types';

interface ServicesGridProps {
  room: Room | null;
  onRequestSuccess: () => void;
}

const ServicesGrid = ({ room, onRequestSuccess }: ServicesGridProps) => {
  const { toast } = useToast();

  const services: Service[] = [
    { 
      icon: <FileText className="h-6 w-6" />, 
      label: 'General Service',
      type: 'service',
      description: 'Request general hotel services'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-secondary mb-6">Room Services</h2>
      
      {/* Search Bar */}
      <div className="mb-6">
        <CommandSearch room={room} onRequestSuccess={onRequestSuccess} />
      </div>
      
      {/* Service Cards Grid */}
      <h3 className="text-lg font-medium text-secondary mb-4">Common Services</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {services.map((service) => (
          <ServiceCard 
            key={service.type}
            icon={service.icon}
            label={service.label}
            type={service.type}
            description={service.description}
            onRequest={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesGrid;
