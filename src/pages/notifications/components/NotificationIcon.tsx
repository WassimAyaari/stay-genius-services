
import React from 'react';
import { 
  CheckCircle2, XCircle, Clock, Timer, ShowerHead, Shirt, 
  PhoneCall, Wifi, FileText, Settings, Search, Utensils, 
  MonitorSmartphone, BellRing, Calendar, Pause
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
    return <Utensils className="h-6 w-6 text-orange-600" />;
  }
  
  if (notificationType === 'spa_booking') {
    return <ShowerHead className="h-6 w-6 text-blue-600" />;
  }
  
  if (notificationType === 'event_reservation') {
    return <Calendar className="h-6 w-6 text-green-600" />;
  }
  
  if (!serviceType) {
    return <BellRing className="h-6 w-6 text-gray-600" />;
  }
  
  switch (serviceType) {
    case 'housekeeping':
      return <ShowerHead className="h-6 w-6 text-blue-600" />;
    case 'laundry':
      return <Shirt className="h-6 w-6 text-purple-600" />;
    case 'wifi':
      return <Wifi className="h-6 w-6 text-indigo-600" />;
    case 'information_technology':
      return <MonitorSmartphone className="h-6 w-6 text-cyan-600" />;
    case 'bill':
      return <FileText className="h-6 w-6 text-emerald-600" />;
    case 'preferences':
      return <Settings className="h-6 w-6 text-amber-600" />;
    case 'concierge':
      return <PhoneCall className="h-6 w-6 text-rose-600" />;
    default:
      return <BellRing className="h-6 w-6 text-gray-600" />;
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
    case 'on_hold':
      return <Pause className="h-5 w-5 text-orange-500" />;
    case 'pending':
    default:
      return <Clock className="h-5 w-5 text-blue-500" />;
  }
};
