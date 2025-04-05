
import React, { useState } from 'react';
import { EventReservation } from '@/types/event';
import { ReservationCard } from './ReservationCard';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  
  const filteredReservations = statusFilter === "all" 
    ? reservations 
    : reservations.filter(res => res.status === statusFilter);

  if (reservations.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">Aucune réservation trouvée pour cet événement</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">
          {reservations.length} {reservations.length > 1 ? 'réservations' : 'réservation'}
        </h3>
        <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
            <TabsTrigger value="cancelled">Annulées</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredReservations.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground">Aucune réservation avec ce statut</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onViewDetails={onViewDetails}
                onUpdateStatus={onUpdateStatus}
                isUpdating={isUpdating}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
