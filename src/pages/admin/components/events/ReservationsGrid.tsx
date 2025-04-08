
import React, { useState } from 'react';
import { EventReservation } from '@/types/event';
import { ReservationCard } from './ReservationCard';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from 'sonner';

interface ReservationsGridProps {
  reservations: EventReservation[];
  onViewDetails: (reservation: EventReservation) => void;
  onUpdateStatus: (reservationId: string, status: 'pending' | 'confirmed' | 'cancelled') => void;
  isUpdating: boolean;
}

export const ReservationsGrid: React.FC<ReservationsGridProps> = ({
  reservations,
  onViewDetails,
  onUpdateStatus,
  isUpdating
}) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Filtering reservations based on status and search term
  const filteredReservations = reservations
    .filter(res => statusFilter === "all" ? true : res.status === statusFilter)
    .filter(res => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        res.guestName?.toLowerCase().includes(term) ||
        res.guestEmail?.toLowerCase().includes(term) ||
        res.guestPhone?.toLowerCase().includes(term) ||
        res.roomNumber?.toLowerCase().includes(term)
      );
    });

  // Wrapper for onUpdateStatus that adds toast notifications
  const handleUpdateStatus = (reservationId: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      // Show loading toast
      toast.loading('Updating status...');
      
      // Call the update function
      onUpdateStatus(reservationId, status);
    } catch (error) {
      console.error('Error in handleUpdateStatus:', error);
      toast.error('Error updating status');
    }
  };

  if (reservations.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md bg-gray-50">
        <p className="text-muted-foreground">No reservations found for this event</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">
          {reservations.length} {reservations.length > 1 ? 'reservations' : 'reservation'}
        </h3>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredReservations.length === 0 ? (
        <div className="text-center py-12 border rounded-md bg-gray-50">
          <p className="text-muted-foreground">
            {searchTerm ? 'No reservations match your search' : 'No reservations with this status'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onViewDetails={onViewDetails}
              onUpdateStatus={handleUpdateStatus}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      )}
    </div>
  );
};
