
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BedDouble, Users, Wifi, Coffee, Tv } from 'lucide-react';

const RoomDetails = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img 
            src="/placeholder.svg"
            alt="Room"
            className="w-full h-[400px] object-cover rounded-lg"
          />
          <div className="grid grid-cols-3 gap-4 mt-4">
            <img src="/placeholder.svg" alt="Room detail" className="w-full h-32 object-cover rounded-lg" />
            <img src="/placeholder.svg" alt="Room detail" className="w-full h-32 object-cover rounded-lg" />
            <img src="/placeholder.svg" alt="Room detail" className="w-full h-32 object-cover rounded-lg" />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-secondary mb-2">Deluxe Ocean View Suite</h1>
            <p className="text-gray-600">Room {id}</p>
          </div>

          <Card className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <BedDouble className="text-primary" />
                <span>King Bed</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-primary" />
                <span>Up to 3 guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="text-primary" />
                <span>Free WiFi</span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="text-primary" />
                <span>Coffee Maker</span>
              </div>
              <div className="flex items-center gap-2">
                <Tv className="text-primary" />
                <span>Smart TV</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-2xl font-semibold">$299</p>
                  <p className="text-sm text-gray-600">per night</p>
                </div>
                <Button className="px-8">Book Now</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Room Description</h2>
            <p className="text-gray-600">
              Luxurious suite featuring breathtaking ocean views, modern amenities, and elegant furnishings. 
              Perfect for both business and leisure travelers seeking comfort and style.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
