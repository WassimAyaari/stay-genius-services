
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRoom } from '@/hooks/useRoom';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { requestService, ServiceType } from '@/features/rooms/controllers/roomService';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import {
  BedDouble,
  Coffee,
  Wifi,
  Tv,
  PhoneCall,
  UtensilsCrossed,
  Wind,
  Loader2,
  ShowerHead,
  Shirt,
  Clock,
  CheckCircle2,
  Timer,
  XCircle
} from 'lucide-react';

const MyRoom = () => {
  const { data: room, isLoading } = useRoom('401');
  const { data: serviceRequests = [], isLoading: isLoadingRequests } = useServiceRequests(room?.id);
  const { toast } = useToast();

  const roomControls = [
    { icon: <Wind className="h-6 w-6" />, label: 'AC Control', value: '22°C' },
    { icon: <Tv className="h-6 w-6" />, label: 'TV', value: 'On' },
    { icon: <Wifi className="h-6 w-6" />, label: 'WiFi', value: 'Connected' },
  ];

  const services = [
    { 
      icon: <UtensilsCrossed className="h-6 w-6" />, 
      label: 'Room Service', 
      type: 'room_service' as const,
      action: 'Order',
      description: 'Order food and beverages'
    },
    { 
      icon: <ShowerHead className="h-6 w-6" />, 
      label: 'Housekeeping', 
      type: 'housekeeping' as const,
      action: 'Request',
      description: 'Room cleaning and maintenance'
    },
    { 
      icon: <Shirt className="h-6 w-6" />, 
      label: 'Laundry',
      type: 'laundry' as const,
      action: 'Order',
      description: 'Laundry and dry cleaning'
    },
    { 
      icon: <PhoneCall className="h-6 w-6" />, 
      label: 'Assistance',
      type: 'maintenance' as const,
      action: 'Call',
      description: 'Request staff assistance'
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

  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case 'room_service':
        return <UtensilsCrossed className="h-5 w-5" />;
      case 'housekeeping':
        return <ShowerHead className="h-5 w-5" />;
      case 'laundry':
        return <Shirt className="h-5 w-5" />;
      case 'maintenance':
        return <PhoneCall className="h-5 w-5" />;
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
      {/* Room Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-secondary mb-2">Room {room?.room_number}</h1>
        <p className="text-gray-600">{room?.type}</p>
      </div>

      {/* Room Status */}
      <Card className="mb-8 p-6 bg-primary/5">
        <div className="flex items-center gap-4">
          <BedDouble className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-lg font-medium text-secondary">Current Stay</h2>
            <p className="text-sm text-gray-600">Check-out: Tomorrow, 11:00 AM</p>
          </div>
        </div>
      </Card>

      {/* Room Controls */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-secondary mb-4">Room Controls</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {roomControls.map((control) => (
            <Card key={control.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className="text-primary">{control.icon}</div>
                <div>
                  <p className="text-sm font-medium">{control.label}</p>
                  <p className="text-sm text-gray-600">{control.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Room Services */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-secondary mb-4">Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <Card key={service.label} className="p-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="text-primary">{service.icon}</div>
                <div>
                  <p className="font-medium mb-1">{service.label}</p>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <Button 
                    variant="outline"
                    onClick={() => handleServiceRequest(service.type)}
                  >
                    {service.action}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Service Requests History */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-secondary mb-4">Service Requests</h2>
        <div className="space-y-4">
          {isLoadingRequests ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : serviceRequests.length > 0 ? (
            serviceRequests.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-primary">
                    {getServiceIcon(request.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium capitalize">{request.type.replace('_', ' ')}</p>
                      {getStatusIcon(request.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(request.created_at).toLocaleString()}
                    </p>
                    {request.description && (
                      <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-4 text-center text-gray-600">
              No service requests yet
            </Card>
          )}
        </div>
      </div>

      {/* Room Amenities */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-secondary mb-4">Room Amenities</h2>
        <Card className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {room?.amenities?.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2 text-gray-600">
                <Coffee className="h-5 w-5" />
                <span className="capitalize">{amenity}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default MyRoom;
