
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Room } from '@/hooks/useRoom';
import { useToast } from '@/hooks/use-toast';
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
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const services: Service[] = [
    {
      icon: <FileText className="h-6 w-6" />,
      label: t('myRoom.services.generalService'),
      type: 'service',
      description: t('myRoom.services.generalServiceDescription')
    },
    {
      icon: <Coffee className="h-6 w-6" />,
      label: t('myRoom.services.roomService'),
      type: 'service',
      description: t('myRoom.services.roomServiceDescription')
    },
    {
      icon: <Shirt className="h-6 w-6" />,
      label: t('myRoom.services.laundry'),
      type: 'service',
      description: t('myRoom.services.laundryDescription')
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      label: t('myRoom.services.maintenance'),
      type: 'service',
      description: t('myRoom.services.maintenanceDescription')
    }
  ];

  const handleServiceRequest = (service: Service) => {
    if (!room) {
      toast({
        title: "Room not found",
        description: "Please ensure you're checked in to request services.",
        variant: "destructive"
      });
      return;
    }
    
    // Implement service request logic here
    toast({
      title: `${service.label} requested`,
      description: "Your request has been submitted successfully.",
    });
    
    onRequestSuccess();
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-secondary mb-6">{t('myRoom.services.title')}</h2>
      
      {/* Search Bar */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-secondary mb-4">{t('myRoom.services.searchServices')}</h3>
        <CommandSearch room={room} onRequestSuccess={onRequestSuccess} />
      </div>
      
      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((service, index) => (
          <ServiceCard 
            key={`${service.type}-${index}`}
            icon={service.icon} 
            title={service.label} 
            description={service.description} 
            onClick={() => handleServiceRequest(service)}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesGrid;
