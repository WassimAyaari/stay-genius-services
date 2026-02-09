import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Home, DoorOpen, Clock, ArrowRight } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Guest, Room, Companion, GuestStatus } from './types';

interface GuestStayContextBarProps {
  guest: Guest;
  room: Room | null;
  companions: Companion[];
  status: GuestStatus;
}

const statusConfig: Record<NonNullable<GuestStatus>, {
  label: string;
  icon: React.ElementType;
  bgClass: string;
  textClass: string;
}> = {
  'in-house': {
    label: 'IN-HOUSE',
    icon: Home,
    bgClass: 'bg-blue-500/10 border-blue-500/30',
    textClass: 'text-blue-600',
  },
  'arrivals': {
    label: 'ARRIVING TODAY',
    icon: ArrowRight,
    bgClass: 'bg-green-500/10 border-green-500/30',
    textClass: 'text-green-600',
  },
  'departures': {
    label: 'DEPARTING TODAY',
    icon: DoorOpen,
    bgClass: 'bg-orange-500/10 border-orange-500/30',
    textClass: 'text-orange-600',
  },
  'upcoming': {
    label: 'UPCOMING',
    icon: CalendarDays,
    bgClass: 'bg-muted border-border',
    textClass: 'text-muted-foreground',
  },
  'past': {
    label: 'PAST GUEST',
    icon: Clock,
    bgClass: 'bg-muted/50 border-border',
    textClass: 'text-muted-foreground',
  },
};

const GuestStayContextBar: React.FC<GuestStayContextBarProps> = ({
  guest,
  room,
  companions,
  status,
}) => {
  const config = status ? statusConfig[status] : null;
  const Icon = config?.icon || CalendarDays;

  const calculateNights = () => {
    if (!guest.check_in_date || !guest.check_out_date) return null;
    return differenceInDays(new Date(guest.check_out_date), new Date(guest.check_in_date));
  };

  const formatStayDates = () => {
    if (!guest.check_in_date || !guest.check_out_date) return 'Dates not set';
    const checkIn = format(new Date(guest.check_in_date), 'MMM d');
    const checkOut = format(new Date(guest.check_out_date), 'MMM d, yyyy');
    const nights = calculateNights();
    return `${checkIn} - ${checkOut}${nights ? ` (${nights} Night${nights > 1 ? 's' : ''})` : ''}`;
  };

  const getOccupancy = () => {
    const adults = companions.filter(c => c.relation !== 'Child').length + 1;
    const children = companions.filter(c => c.relation === 'Child').length;
    const parts = [];
    parts.push(`${adults} Adult${adults > 1 ? 's' : ''}`);
    if (children > 0) parts.push(`${children} Child${children > 1 ? 'ren' : ''}`);
    return parts.join(', ');
  };

  const getRoomInfo = () => {
    if (!guest.room_number) return 'Pending Assignment';
    const roomType = room?.type ? ` (${room.type})` : '';
    return `Room #${guest.room_number}${roomType}`;
  };

  const getReservationId = () => {
    return `#HG-${guest.id.slice(0, 5).toUpperCase()}`;
  };

  if (!status) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">No stay information available</p>
      </div>
    );
  }

  return (
    <div className={cn(
      'rounded-lg border p-4 space-y-2',
      config?.bgClass
    )}>
      <div className="flex items-center gap-3 flex-wrap">
        <Badge className={cn('font-semibold', config?.textClass, config?.bgClass)}>
          <Icon className="mr-1.5 h-3.5 w-3.5" />
          {config?.label}
        </Badge>
        <span className="text-sm font-medium">{formatStayDates()}</span>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <span className="font-medium text-foreground">{getRoomInfo()}</span>
        <span>•</span>
        <span>{getOccupancy()}</span>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Reservation ID: {getReservationId()}
      </div>
    </div>
  );
};

export default GuestStayContextBar;
