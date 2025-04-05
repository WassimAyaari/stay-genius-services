
import React, { useState } from 'react';
import { EventReservation } from '@/types/event';
import { ReservationCard } from './ReservationCard';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

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
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredReservations = reservations
    .filter(res => statusFilter === "all" ? true : res.status === statusFilter)
    .filter(res => {
      const searchTermLower = searchTerm.toLowerCase();
      return searchTerm === "" || 
        (res.guestName && res.guestName.toLowerCase().includes(searchTermLower)) ||
        (res.guestEmail && res.guestEmail.toLowerCase().includes(searchTermLower)) ||
        (res.roomNumber && res.roomNumber.toLowerCase().includes(searchTermLower));
    });

  const countByStatus = {
    all: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  };

  if (reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-muted-foreground text-lg">Aucune réservation trouvée pour cet événement</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium mb-1">
            Réservations
          </h3>
          <p className="text-muted-foreground text-sm">
            {reservations.length} {reservations.length > 1 ? 'réservations' : 'réservation'} disponibles
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une réservation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter} className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-6">
          <TabsTrigger value="all" className="flex flex-col py-3">
            <span>Toutes</span>
            <span className="text-xs font-normal mt-1 bg-blue-100 px-2 py-0.5 rounded-full">{countByStatus.all}</span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex flex-col py-3">
            <span>En attente</span>
            <span className="text-xs font-normal mt-1 bg-yellow-100 px-2 py-0.5 rounded-full">{countByStatus.pending}</span>
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="flex flex-col py-3">
            <span>Confirmées</span> 
            <span className="text-xs font-normal mt-1 bg-green-100 px-2 py-0.5 rounded-full">{countByStatus.confirmed}</span>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex flex-col py-3">
            <span>Annulées</span>
            <span className="text-xs font-normal mt-1 bg-red-100 px-2 py-0.5 rounded-full">{countByStatus.cancelled}</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredReservations.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <p className="text-muted-foreground">Aucune réservation avec ce statut ou correspondant à votre recherche</p>
          {searchTerm && (
            <button 
              className="text-blue-500 mt-2 text-sm underline"
              onClick={() => setSearchTerm("")}
            >
              Effacer la recherche
            </button>
          )}
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
