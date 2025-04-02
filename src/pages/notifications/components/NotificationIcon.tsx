
import React from 'react';
import { 
  CheckCircle2, XCircle, Clock, Timer, ShowerHead, Shirt, 
  PhoneCall, Wifi, FileText, Settings, Search, Utensils 
} from 'lucide-react';

interface NotificationIconProps {
  notificationType: string;
  serviceType?: string;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({ 
  notificationType, 
  serviceType 
}) => {
  if (notificationType === 'reservation') {
    return <Utensils className="h-6 w-6" />;
  }
  
  if (notificationType === 'spa_booking') {
    return <ShowerHead className="h-6 w-6" />;
  }
  
  if (!serviceType) {
    return <Search className="h-6 w-6" />;
  }
  
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
      return <Search className="h-6 w-6" />;
  }
};

interface StatusIconProps {
  status: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  switch (status) {
    case 'completed':
    case 'confirmed':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'in_progress':
      return <Timer className="h-5 w-5 text-yellow-500" />;
    case 'cancelled':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'pending':
    default:
      return <Clock className="h-5 w-5 text-blue-500" />;
  }
};
