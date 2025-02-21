
import React from 'react';
import { useRoom } from '@/hooks/useRoom';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { requestService, ServiceType } from '@/features/rooms/controllers/roomService';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import { UtensilsCrossed, ShowerHead, Shirt, PhoneCall, Loader2 } from 'lucide-react';
import WelcomeBanner from './components/WelcomeBanner';
import ServiceCard from './components/ServiceCard';
import RequestHistory from './components/RequestHistory';
import { Service } from './types';

const MyRoom = () => {
  const { data: room, isLoading } = useRoom('401');
  const { data: serviceRequests = [], isLoading: isLoadingRequests } = useServiceRequests(room?.id);
  const { toast } = useToast();

  const services: Service[] = [
    { 
      icon: <UtensilsCrossed className="h-6 w-6" />, 
      label: 'Room Service', 
      type: 'room_service',
      description: 'Order food and beverages to your room'
    },
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
      icon: <PhoneCall className="h-6 w-6" />, 
      label: 'Concierge',
      type: 'maintenance',
      description: '24/7 concierge assistance'
    },
  ];

  const handleServiceRequest = async (type: ServiceType) => {
    try {
      if (!room) return;
      await requestService(room.id, type);
      toast({
        title: "Service Requested",
        description: "Your request has been sent successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request service. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <WelcomeBanner room={room} />

      <h2 className="text-2xl font-bold text-secondary mb-6">Room Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {services.map((service) => (
          <ServiceCard 
            key={service.type}
            {...service}
            onRequest={handleServiceRequest}
          />
        ))}
      </div>

      <RequestHistory 
        isLoading={isLoadingRequests}
        requests={serviceRequests}
        services={services}
      />
    </Layout>
  );
};

export default MyRoom;
