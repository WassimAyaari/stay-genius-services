
import React, { useState } from 'react';
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
  XCircle,
  ChevronUp,
  ChevronDown,
  Power,
  Volume2,
  VolumeX,
  AlertCircle,
  BarChart2,
  CalendarClock,
  Settings
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

  const roomControls = [
    { 
      icon: <Wind className="h-6 w-6" />, 
      label: 'AC Control', 
      value: `${temperature}°C`,
      controls: (
        <div className="flex gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleTemperatureChange(false)}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleTemperatureChange(true)}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      )
    },
    { 
      icon: <Tv className="h-6 w-6" />, 
      label: 'TV', 
      value: tvPower ? 'On' : 'Off',
      controls: (
        <div className="space-y-2 mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={toggleTvPower}
          >
            <Power className="h-4 w-4 mr-2" />
            {tvPower ? 'Turn Off' : 'Turn On'}
          </Button>
          {tvPower && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleTvVolume(false)}
              >
                <VolumeX className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleTvVolume(true)}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )
    },
    { 
      icon: <Wifi className="h-6 w-6" />, 
      label: 'WiFi', 
      value: wifiConnected ? 'Connected' : 'Disconnected',
      controls: (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2"
          onClick={toggleWifi}
        >
          {wifiConnected ? 'Disconnect' : 'Connect'}
        </Button>
      )
    },
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
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Room Management Dashboard</h1>
          <p className="text-gray-600">Room {room?.room_number} | {room?.type}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">Check-out</p>
            <p className="text-sm text-gray-600">Tomorrow, 11:00 AM</p>
          </div>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Room Temperature</p>
              <p className="text-2xl font-semibold">{temperature}°C</p>
            </div>
            <Wind className="h-8 w-8 text-primary opacity-60" />
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Energy Usage</p>
              <p className="text-2xl font-semibold">4.2 kWh</p>
            </div>
            <BarChart2 className="h-8 w-8 text-green-500 opacity-60" />
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Requests</p>
              <p className="text-2xl font-semibold">{serviceRequests.filter(r => r.status === 'in_progress').length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500 opacity-60" />
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Time in Room</p>
              <p className="text-2xl font-semibold">16h 24m</p>
            </div>
            <CalendarClock className="h-8 w-8 text-blue-500 opacity-60" />
          </div>
        </Card>
      </div>

      {/* Room Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Main Controls */}
        <div className="md:col-span-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Room Controls
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roomControls.map((control) => (
                <Card key={control.label} className="p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="text-primary">{control.icon}</div>
                        <p className="font-medium">{control.label}</p>
                      </div>
                      <p className="text-sm text-gray-600">{control.value}</p>
                    </div>
                    {control.controls}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {/* Service Quick Actions */}
        <div className="md:col-span-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-primary" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              {services.map((service) => (
                <Button
                  key={service.type}
                  variant="outline"
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => handleServiceRequest(service.type)}
                >
                  {service.icon}
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{service.label}</span>
                    <span className="text-xs text-gray-600">{service.description}</span>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Service History */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Activities
          </h2>
          <div className="space-y-4">
            {isLoadingRequests ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : serviceRequests.length > 0 ? (
              serviceRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
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
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No recent activities</p>
            )}
          </div>
        </div>
      </Card>

      {/* Room Info */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BedDouble className="h-5 w-5 text-primary" />
            Room Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {room?.amenities?.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2 text-gray-600">
                <Coffee className="h-5 w-5" />
                <span className="capitalize">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default MyRoom;
