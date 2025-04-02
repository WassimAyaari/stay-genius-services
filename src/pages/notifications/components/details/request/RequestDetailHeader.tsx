
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, FileText, Loader2, PhoneCall, Settings, ShowerHead, Shirt, Wifi, XCircle } from 'lucide-react';

interface RequestDetailHeaderProps {
  serviceType?: string;
  status: string;
}

export const RequestDetailHeader: React.FC<RequestDetailHeaderProps> = ({ serviceType, status }) => {
  // Get status information
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return "Complétée";
      case 'in_progress': return "En cours";
      case 'cancelled': return "Annulée";
      default: return "En attente";
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed': return "bg-green-100 text-green-800";
      case 'in_progress': return "bg-blue-100 text-blue-800";
      case 'cancelled': return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };
  
  // Get request type icon
  const getTypeIcon = (serviceType?: string) => {
    if (!serviceType) return <FileText className="h-6 w-6" />;
    
    switch (serviceType) {
      case 'housekeeping':
        return <ShowerHead className="h-6 w-6" />;
      case 'laundry':
        return <Shirt className="h-6 w-6" />;
      case 'wifi':
        return <Wifi className="h-6 w-6" />;
      case 'bill':
        return <FileText className="h-6 w-6" />;
      case 'preferences':
        return <Settings className="h-6 w-6" />;
      case 'concierge':
        return <PhoneCall className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };
  
  const getTypeText = (serviceType?: string) => {
    if (!serviceType) return "Service";
    
    switch (serviceType) {
      case 'housekeeping': return "Service de chambre";
      case 'laundry': return "Service de blanchisserie";
      case 'wifi': return "Assistance WiFi";
      case 'bill': return "Demande de facture";
      case 'preferences': return "Préférences";
      case 'concierge': return "Service de conciergerie";
      default: return serviceType || "Service";
    }
  };

  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-full">
          {getTypeIcon(serviceType)}
        </div>
        <CardTitle>{getTypeText(serviceType)}</CardTitle>
      </div>
      <Badge className={getStatusClass(status)}>{getStatusText(status)}</Badge>
    </div>
  );
};
