
import React from 'react';
import { Room } from '@/hooks/useRoom';
import { useToast } from '@/components/ui/use-toast';
import { FileText, Coffee, Shirt, Wrench, Wifi, ShoppingBag, Search } from 'lucide-react';
import CommandSearch from './CommandSearch';
import ServiceCard from './ServiceCard';
import { Service } from '../types';

interface ServicesGridProps {
  room: Room | null;
  onRequestSuccess: () => void;
}

const ServicesGrid = ({
  room,
  onRequestSuccess
}: ServicesGridProps) => {
  const {
    toast
  } = useToast();
  
  const services: Service[] = [
    {
      icon: <FileText className="h-6 w-6" />,
      label: 'General Service',
      type: 'service',
      description: 'Request general hotel services'
    }, 
    {
      icon: <Coffee className="h-6 w-6" />,
      label: 'Room Service',
      type: 'service',
      description: 'Order food and drinks to your room'
    }, 
    {
      icon: <Shirt className="h-6 w-6" />,
      label: 'Laundry',
      type: 'service',
      description: 'Laundry and dry cleaning services'
    }, 
    {
      icon: <Wrench className="h-6 w-6" />,
      label: 'Maintenance',
      type: 'service',
      description: 'Report maintenance issues'
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-secondary mb-6">Room Services</h2>
      
      {/* Search Bar */}
      <div className="mb-8 relative">
        <h3 className="text-lg font-medium text-secondary mb-4">Search Services</h3>
        <CommandSearch room={room} onRequestSuccess={onRequestSuccess} />
      </div>
      
      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            icon={service.icon}
            title={service.label}
            description={service.description}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesGrid;
