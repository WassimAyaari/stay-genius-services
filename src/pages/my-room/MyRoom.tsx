
import React, { useState } from 'react';
import { useRoom } from '@/hooks/useRoom';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { requestService, ServiceType } from '@/features/rooms/controllers/roomService';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import { 
  ShowerHead, 
  Shirt, 
  PhoneCall, 
  Loader2, 
  Wifi, 
  FileText, 
  Settings, 
  Search 
} from 'lucide-react';
import WelcomeBanner from './components/WelcomeBanner';
import ServiceCard from './components/ServiceCard';
import RequestHistory from './components/RequestHistory';
import { Service } from './types';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

const MyRoom = () => {
  const { data: room, isLoading } = useRoom('401');
  const { data: serviceRequests = [], isLoading: isLoadingRequests } = useServiceRequests(room?.id);
  const { toast } = useToast();
  const [customRequest, setCustomRequest] = useState('');

  const form = useForm();

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

  const handleCustomRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRequest.trim() || !room) return;
    
    try {
      await requestService(room.id, 'custom', customRequest);
      setCustomRequest('');
      toast({
        title: "Custom Request Sent",
        description: "Your custom request has been submitted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
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

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-secondary mb-4">Custom Request</h2>
        <form onSubmit={handleCustomRequest} className="flex gap-2">
          <Input
            value={customRequest}
            onChange={(e) => setCustomRequest(e.target.value)}
            placeholder="Extra pillows, amenities, etc."
            className="flex-1"
          />
          <Button type="submit">Submit</Button>
        </form>
      </div>

      <h2 className="text-2xl font-bold text-secondary mb-6">Room Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
