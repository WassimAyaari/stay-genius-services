
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';

interface RequestStatusBadgeProps {
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

export const RequestStatusBadge = ({ status }: RequestStatusBadgeProps) => {
  const getStatusText = () => {
    switch (status) {
      case 'completed': return "Complétée";
      case 'in_progress': return "En cours";
      case 'cancelled': return "Annulée";
      default: return "En attente";
    }
  };
  
  const getStatusClass = () => {
    switch (status) {
      case 'completed': return "bg-green-100 text-green-800";
      case 'in_progress': return "bg-blue-100 text-blue-800";
      case 'cancelled': return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };
  
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 mr-1" />;
      case 'in_progress':
        return <Loader2 className="h-4 w-4 mr-1 animate-spin" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 mr-1" />;
      default:
        return <Clock className="h-4 w-4 mr-1" />;
    }
  };
  
  return (
    <Badge className={`flex items-center ${getStatusClass()}`}>
      {getStatusIcon()}
      {getStatusText()}
    </Badge>
  );
};
