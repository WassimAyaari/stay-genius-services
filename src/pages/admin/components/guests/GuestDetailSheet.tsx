import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Loader2, User } from 'lucide-react';
import { isToday, isBefore, isAfter, startOfDay } from 'date-fns';

import GuestStayContextBar from './GuestStayContextBar';
import GuestProfileCard from './GuestProfileCard';
import GuestPreferencesCard from './GuestPreferencesCard';
import GuestActivityCard from './GuestActivityCard';
import GuestIntelligenceCard from './GuestIntelligenceCard';
import { Guest, GuestStatus } from './types';

interface GuestDetailSheetProps {
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
}

const GuestDetailSheet: React.FC<GuestDetailSheetProps> = ({
  guest,
  isOpen,
  onClose,
}) => {
  const today = startOfDay(new Date());

  const getGuestStatus = (checkIn: string | null, checkOut: string | null): GuestStatus => {
    if (!checkIn || !checkOut) return null;
    const checkInDate = startOfDay(new Date(checkIn));
    const checkOutDate = startOfDay(new Date(checkOut));

    if (isToday(checkInDate)) return 'arrivals';
    if (isToday(checkOutDate)) return 'departures';
    if (!isBefore(today, checkInDate) && !isAfter(today, checkOutDate)) return 'in-house';
    if (isAfter(checkInDate, today)) return 'upcoming';
    if (isBefore(checkOutDate, today)) return 'past';
    return null;
  };

  // Fetch room details
  const { data: room } = useQuery({
    queryKey: ['room', guest?.room_number],
    queryFn: async () => {
      if (!guest?.room_number) return null;
      const { data } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_number', guest.room_number)
        .single();
      return data;
    },
    enabled: !!guest?.room_number,
  });

  // Fetch companions
  const { data: companions = [] } = useQuery({
    queryKey: ['companions', guest?.user_id],
    queryFn: async () => {
      if (!guest?.user_id) return [];
      const { data } = await supabase
        .from('companions')
        .select('*')
        .eq('user_id', guest.user_id)
        .order('created_at', { ascending: true });
      return data || [];
    },
    enabled: !!guest?.user_id,
  });

  // Fetch service requests
  const { data: serviceRequests = [] } = useQuery({
    queryKey: ['guest-service-requests', guest?.id, guest?.user_id],
    queryFn: async () => {
      if (!guest) return [];
      let query = supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (guest.user_id) {
        query = query.or(`guest_id.eq.${guest.user_id},guest_id.eq.${guest.id}`);
      } else {
        query = query.eq('guest_id', guest.id);
      }

      const { data } = await query;
      return data || [];
    },
    enabled: !!guest,
  });

  // Fetch table reservations
  const { data: tableReservations = [] } = useQuery({
    queryKey: ['guest-table-reservations', guest?.user_id, guest?.email],
    queryFn: async () => {
      if (!guest) return [];
      let query = supabase
        .from('table_reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (guest.user_id) {
        query = query.eq('user_id', guest.user_id);
      } else if (guest.email) {
        query = query.eq('guest_email', guest.email);
      } else {
        return [];
      }

      const { data } = await query;
      return data || [];
    },
    enabled: !!guest,
  });

  // Fetch spa bookings
  const { data: spaBookings = [] } = useQuery({
    queryKey: ['guest-spa-bookings', guest?.user_id, guest?.email],
    queryFn: async () => {
      if (!guest) return [];
      let query = supabase
        .from('spa_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (guest.user_id) {
        query = query.eq('user_id', guest.user_id);
      } else if (guest.email) {
        query = query.eq('guest_email', guest.email);
      } else {
        return [];
      }

      const { data } = await query;
      return data || [];
    },
    enabled: !!guest,
  });

  // Fetch event reservations
  const { data: eventReservations = [] } = useQuery({
    queryKey: ['guest-event-reservations', guest?.user_id, guest?.email],
    queryFn: async () => {
      if (!guest) return [];
      let query = supabase
        .from('event_reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (guest.user_id) {
        query = query.eq('user_id', guest.user_id);
      } else if (guest.email) {
        query = query.eq('guest_email', guest.email);
      } else {
        return [];
      }

      const { data } = await query;
      return data || [];
    },
    enabled: !!guest,
  });

  const isLoading = !guest;
  const status = guest ? getGuestStatus(guest.check_in_date, guest.check_out_date) : null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Guest 360°
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : guest ? (
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
              {/* Stay Context Bar */}
              <GuestStayContextBar
                guest={guest}
                room={room || null}
                companions={companions}
                status={status}
              />

              <Separator />

              {/* Profile Card */}
              <GuestProfileCard guest={guest} companions={companions} />

              {/* Preferences Card */}
              <GuestPreferencesCard guestId={guest.id} />

              {/* Activity Card */}
              <GuestActivityCard
                serviceRequests={serviceRequests}
                tableReservations={tableReservations}
                spaBookings={spaBookings}
                eventReservations={eventReservations}
              />

              {/* Intelligence Card */}
              <GuestIntelligenceCard guest={guest} />
            </div>
          </ScrollArea>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};

export default GuestDetailSheet;
