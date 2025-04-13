
import React from 'react';
import { Room } from '@/hooks/useRoom';
import { requestService } from '@/features/rooms/controllers/roomService';
import { ServiceType } from '@/features/rooms/types';
import { useToast } from '@/components/ui/use-toast';
import { MessageSquare, FileText } from 'lucide-react';
import ServiceCard from './ServiceCard';
import { Service } from '../types';
import { useUserInfo } from '../hooks/useUserInfo';

interface ServicesGridProps {
  room: Room | null;
  onRequestSuccess: () => void;
}

const ServicesGrid = ({ room, onRequestSuccess }: ServicesGridProps) => {
  const { toast } = useToast();
  const { getUserInfo } = useUserInfo(room);

  const services: Service[] = [
    { 
      icon: <MessageSquare className="h-6 w-6" />, 
      label: 'Custom Request', 
      type: 'custom',
      description: 'Submit a custom service request'
    },
    { 
      icon: <FileText className="h-6 w-6" />, 
      label: 'General Service',
      type: 'service',
      description: 'Request general hotel services'
    }
  ];

  const handleServiceRequest = async (type: ServiceType) => {
    try {
      if (!room) return;
      
      const userInfo = getUserInfo();
      
      await requestService(
        room.id, 
        type, 
        `Request for ${type}`, 
        undefined, 
        undefined
      );
      
      toast({
        title: "Service Requested",
        description: "Your request has been sent successfully.",
      });
      
      onRequestSuccess();
    } catch (error) {
      console.error("Error requesting service:", error);
      toast({
        title: "Error",
        description: "Failed to request service. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-secondary mb-6">Room Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {services.map((service) => (
          <ServiceCard 
            key={service.type}
            icon={service.icon}
            label={service.label}
            type={service.type}
            description={service.description}
            onRequest={handleServiceRequest}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesGrid;
