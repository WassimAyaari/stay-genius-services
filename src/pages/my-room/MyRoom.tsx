
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRoom } from '@/hooks/useRoom';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { requestService, ServiceType } from '@/features/rooms/controllers/roomService';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import {
  BedDouble, Coffee, Wifi, Tv, PhoneCall, UtensilsCrossed,
  Wind, Loader2, ShowerHead, Shirt, Clock, CheckCircle2,
  Timer, XCircle, ChevronUp, ChevronDown, Power, Volume2,
  VolumeX, AlertCircle, BarChart2, CalendarClock, Settings
} from 'lucide-react';

const MyRoom = () => {
  const { data: room, isLoading } = useRoom('401');
  const { data: serviceRequests = [], isLoading: isLoadingRequests } = useServiceRequests(room?.id);
  const { toast } = useToast();

  const [temperature, setTemperature] = useState(22);
  const [tvPower, setTvPower] = useState(true);
  const [tvVolume, setTvVolume] = useState(30);
  const [wifiConnected, setWifiConnected] = useState(true);

  const handleTemperatureChange = (increment: boolean) => {
    setTemperature(prev => {
      const newTemp = increment ? prev + 1 : prev - 1;
      if (newTemp >= 16 && newTemp <= 30) {
        toast({
          title: "Temperature Updated",
          description: `Room temperature set to ${newTemp}°C`,
        });
        return newTemp;
      }
      return prev;
    });
  };

  const toggleTvPower = () => {
    setTvPower(prev => !prev);
    toast({
      title: "TV Power",
      description: tvPower ? "TV turned off" : "TV turned on",
    });
  };

  const handleTvVolume = (increment: boolean) => {
    setTvVolume(prev => {
      const newVolume = increment ? Math.min(100, prev + 10) : Math.max(0, prev - 10);
      toast({
        title: "TV Volume",
        description: `Volume set to ${newVolume}%`,
      });
      return newVolume;
    });
  };

  const toggleWifi = () => {
    setWifiConnected(prev => !prev);
    toast({
      title: "WiFi Connection",
      description: wifiConnected ? "WiFi disconnected" : "WiFi connected",
    });
  };

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

      {/* Smart Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Wind className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Temperature</p>
              <p className="text-2xl font-bold text-secondary">{temperature}°C</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl"
              onClick={() => handleTemperatureChange(false)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => handleTemperatureChange(true)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Tv className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Smart TV</p>
              <p className="text-2xl font-bold text-secondary">{tvPower ? 'On' : 'Off'}</p>
            </div>
          </div>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full rounded-xl"
              onClick={toggleTvPower}
            >
              <Power className="h-4 w-4 mr-2" />
              {tvPower ? 'Turn Off' : 'Turn On'}
            </Button>
            {tvPower && (
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => handleTvVolume(false)}
                >
                  <VolumeX className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => handleTvVolume(true)}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Wifi className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">WiFi</p>
              <p className="text-2xl font-bold text-secondary">
                {wifiConnected ? 'Connected' : 'Off'}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full rounded-xl"
            onClick={toggleWifi}
          >
            {wifiConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </Card>
      </div>

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
