
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BedDouble, Coffee, Wifi, Tv, PhoneCall, UtensilsCrossed, Wind } from 'lucide-react';

const MyRoom = () => {
  const roomControls = [
    { icon: <Wind className="h-6 w-6" />, label: 'AC Control', value: '22°C' },
    { icon: <Tv className="h-6 w-6" />, label: 'TV', value: 'On' },
    { icon: <Wifi className="h-6 w-6" />, label: 'WiFi', value: 'Connected' },
  ];

  const services = [
    { icon: <UtensilsCrossed className="h-6 w-6" />, label: 'Room Service', action: 'Order' },
    { icon: <Coffee className="h-6 w-6" />, label: 'Housekeeping', action: 'Request' },
    { icon: <PhoneCall className="h-6 w-6" />, label: 'Front Desk', action: 'Call' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Room Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-secondary mb-2">Room 401</h1>
        <p className="text-gray-600">Deluxe Ocean View Suite</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card key={service.label} className="p-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="text-primary">{service.icon}</div>
                <div>
                  <p className="font-medium mb-2">{service.label}</p>
                  <Button variant="outline">{service.action}</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyRoom;
