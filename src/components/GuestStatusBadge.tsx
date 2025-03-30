
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';

interface GuestStatusBadgeProps {
  status?: string;
  className?: string;
}

const GuestStatusBadge: React.FC<GuestStatusBadgeProps> = ({ 
  status = 'Premium Guest',
  className
}) => {
  return (
    <Badge 
      variant="secondary" 
      className={`flex items-center gap-1 bg-amber-100 text-amber-800 hover:bg-amber-200 ${className}`}
    >
      <Crown size={14} className="text-amber-600" />
      {status}
    </Badge>
  );
};

export default GuestStatusBadge;
