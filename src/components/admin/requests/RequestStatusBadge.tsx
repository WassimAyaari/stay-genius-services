
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Loader, CheckCircle2, X } from 'lucide-react';

interface RequestStatusBadgeProps {
  status: string;
}

export const RequestStatusBadge = ({ status }: RequestStatusBadgeProps) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="flex items-center"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
    case 'in_progress':
      return <Badge variant="secondary" className="flex items-center"><Loader className="mr-1 h-3 w-3" /> In Progress</Badge>;
    case 'completed':
      return <Badge variant="default" className="bg-green-500 flex items-center"><CheckCircle2 className="mr-1 h-3 w-3" /> Completed</Badge>;
    case 'cancelled':
      return <Badge variant="destructive" className="flex items-center"><X className="mr-1 h-3 w-3" /> Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
