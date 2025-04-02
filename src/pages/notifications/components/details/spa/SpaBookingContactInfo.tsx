
import React from 'react';
import { User, Mail, Phone, Home, FileText } from 'lucide-react';

interface SpaBookingContactInfoProps {
  booking: {
    guest_name: string;
    guest_email: string;
    guest_phone?: string;
    room_number?: string;
    special_requests?: string;
  };
}

export const SpaBookingContactInfo: React.FC<SpaBookingContactInfoProps> = ({ booking }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium">Informations de contact</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-gray-500" />
          <div>
            <p className="font-medium">Nom</p>
            <p className="text-gray-600">{booking.guest_name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-gray-500" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-gray-600">{booking.guest_email}</p>
          </div>
        </div>
        
        {booking.guest_phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-gray-500" />
            <div>
              <p className="font-medium">Téléphone</p>
              <p className="text-gray-600">{booking.guest_phone}</p>
            </div>
          </div>
        )}
        
        {booking.room_number && (
          <div className="flex items-center gap-2 text-sm">
            <Home className="h-4 w-4 text-gray-500" />
            <div>
              <p className="font-medium">Chambre</p>
              <p className="text-gray-600">{booking.room_number}</p>
            </div>
          </div>
        )}
      </div>
      
      {booking.special_requests && (
        <div className="flex items-start gap-2 text-sm mt-4">
          <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium">Demandes spéciales</p>
            <p className="text-gray-600">{booking.special_requests}</p>
          </div>
        </div>
      )}
    </div>
  );
};
