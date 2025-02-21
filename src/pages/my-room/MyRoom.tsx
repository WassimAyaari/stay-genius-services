
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRoom } from '@/hooks/useRoom';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { requestService, ServiceType } from '@/features/rooms/controllers/roomService';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import {
  BedDouble, PhoneCall, UtensilsCrossed,
  Loader2, ShowerHead, Shirt, Clock, CheckCircle2,
  Timer, XCircle,
} from 'lucide-react';

const MyRoom = () => {
  const { data: room, isLoading } = useRoom('401');
  const { data: serviceRequests = [], isLoading: isLoadingRequests } = useServiceRequests(room?.id);
  const { toast } = useToast();

  const services = [
    { 
      icon: <UtensilsCrossed className="h-6 w-6" />, 
      label: 'Room Service', 
      type: 'room_service' as const,
      description: 'Order food and beverages to your room'
    },
    { 
      icon: <ShowerHead className="h-6 w-6" />, 
      label: 'Housekeeping', 
      type: 'housekeeping' as const,
      description: 'Request room cleaning services'
    },
    { 
      icon: <Shirt className="h-6 w-6" />, 
      label: 'Laundry Service',
      type: 'laundry' as const,
      description: 'Laundry pickup and delivery'
    },
    { 
      icon: <PhoneCall className="h-6 w-6" />, 
      label: 'Concierge',
      type: 'maintenance' as const,
      description: '24/7 concierge assistance'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Timer className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

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
      {/* Welcome Banner */}
      <Card className="mb-8 p-8 bg-gradient-to-r from-primary-light via-white to-white border-none shadow-lg rounded-3xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-secondary mb-2">Suite 401</h1>
            <p className="text-gray-600 text-lg">{room?.type}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">Check-out</p>
            <p className="text-lg font-semibold text-secondary">Tomorrow, 11:00 AM</p>
          </div>
        </div>
      </Card>

      {/* Room Services */}
      <h2 className="text-2xl font-bold text-secondary mb-6">Room Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {services.map((service) => (
          <Card 
            key={service.type}
            className="p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                {service.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{service.label}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                <Button 
                  variant="outline"
                  className="w-full rounded-xl"
                  onClick={() => handleServiceRequest(service.type)}
                >
                  Request Service
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Requests */}
      <h2 className="text-2xl font-bold text-secondary mb-6">Recent Requests</h2>
      <Card className="rounded-2xl overflow-hidden">
        <div className="p-6 space-y-4">
          {isLoadingRequests ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : serviceRequests.length > 0 ? (
            serviceRequests.map((request) => (
              <div 
                key={request.id} 
                className="flex items-center gap-4 p-4 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors"
              >
                <div className="p-2 bg-white rounded-lg">
                  {services.find(s => s.type === request.type)?.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium capitalize">{request.type.replace('_', ' ')}</p>
                    {getStatusIcon(request.status)}
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(request.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 py-4">No recent requests</p>
          )}
        </div>
      </Card>
    </Layout>
  );
};

export default MyRoom;
