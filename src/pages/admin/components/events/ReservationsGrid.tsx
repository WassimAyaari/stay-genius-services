
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
      toast.promise(
        new Promise((resolve, reject) => {
          try {
            onUpdateStatus(reservationId, status);
            resolve(true);
          } catch (err) {
            reject(err);
          }
        }),
        {
          loading: 'Mise à jour du statut...',
          success: 'Statut mis à jour avec succès',
          error: 'Erreur lors de la mise à jour du statut'
        }
      );
    } catch (error) {
      console.error('Error in handleUpdateStatus:', error);
    }
  };

  if (reservations.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md bg-gray-50">
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
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
              <TabsTrigger value="cancelled">Annulées</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredReservations.length === 0 ? (
        <div className="text-center py-12 border rounded-md bg-gray-50">
          <p className="text-muted-foreground">
            {searchTerm ? 'Aucune réservation ne correspond à votre recherche' : 'Aucune réservation avec ce statut'}
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
