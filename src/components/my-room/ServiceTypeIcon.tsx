
import React from 'react';
import { ShowerHead, Shirt, PhoneCall, Wifi, FileText, Settings, Search } from 'lucide-react';
import { ServiceType } from '@/features/rooms/types';

interface ServiceTypeIconProps {
  type: string;
  className?: string;
}

export const ServiceTypeIcon = ({ type, className = "h-6 w-6" }: ServiceTypeIconProps) => {
  switch (type as ServiceType) {
    case 'housekeeping':
      return <ShowerHead className={className} />;
    case 'laundry':
      return <Shirt className={className} />;
    case 'wifi':
      return <Wifi className={className} />;
    case 'bill':
      return <FileText className={className} />;
    case 'preferences':
      return <Settings className={className} />;
    case 'concierge':
      return <PhoneCall className={className} />;
    default:
      return <Search className={className} />;
  }
};

export const getServiceTypeText = (type: string): string => {
  switch (type as ServiceType) {
    case 'housekeeping': return "Service de chambre";
    case 'laundry': return "Service de blanchisserie";
    case 'wifi': return "Assistance WiFi";
    case 'bill': return "Demande de facture";
    case 'preferences': return "Préférences";
    case 'concierge': return "Service de conciergerie";
    default: return type || "Service";
  }
};
