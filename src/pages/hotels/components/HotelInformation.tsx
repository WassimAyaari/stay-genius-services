
import React from 'react';
import { Hotel } from '@/lib/types';
import { MapPin, Phone, Mail } from 'lucide-react';

interface HotelInformationProps {
  hotel: Hotel;
}

const HotelInformation = ({ hotel }: HotelInformationProps) => {
  return (
    <div className="bg-white py-6 px-4 md:px-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-primary">{hotel.name}</h1>
        <div className="flex flex-col md:flex-row gap-4 mt-2 text-gray-600">
          {hotel.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{hotel.address}</span>
            </div>
          )}
          {hotel.contact_phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{hotel.contact_phone}</span>
            </div>
          )}
          {hotel.contact_email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{hotel.contact_email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelInformation;
