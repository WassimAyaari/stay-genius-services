
import React from 'react';
import { Room } from '@/hooks/useRoom';
import { requestService } from '@/features/rooms/controllers/roomService';
import { ServiceType } from '@/features/rooms/types';
import { useToast } from '@/components/ui/use-toast';
import { ShowerHead, Shirt, PhoneCall, Wifi, FileText, Settings } from 'lucide-react';
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
      icon: <ShowerHead className="h-6 w-6" />, 
      label: 'Housekeeping', 
      type: 'housekeeping',
      description: 'Request room cleaning services'
    },
    { 
      icon: <Shirt className="h-6 w-6" />, 
      label: 'Laundry Service',
      type: 'laundry',
      description: 'Laundry pickup and delivery'
    },
    { 
      icon: <Wifi className="h-6 w-6" />, 
      label: 'WiFi Access',
      type: 'wifi',
      description: 'Connect to high-speed internet'
    },
    { 
      icon: <FileText className="h-6 w-6" />, 
      label: 'Guest Bill',
      type: 'bill',
      description: 'View your current charges'
    },
    { 
      icon: <Settings className="h-6 w-6" />, 
      label: 'Preferences',
      type: 'preferences',
      description: 'Set your room preferences'
    },
    { 
      icon: <PhoneCall className="h-6 w-6" />, 
      label: 'Concierge',
      type: 'concierge',
      description: '24/7 concierge assistance'
    },
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
        undefined, 
        userInfo.name, 
        userInfo.roomNumber
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
