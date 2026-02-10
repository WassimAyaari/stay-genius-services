
import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, RefreshCw, MessageSquare, Mail, Phone, Home } from 'lucide-react';
import { TableReservation } from '@/features/dining/types';
import StatusDialog from '@/components/admin/reservations/StatusDialog';
import { useTableReservations } from '@/hooks/useTableReservations';

interface InlineReservationsPanelProps {
  restaurantId: string;
  restaurantName: string;
  onBack: () => void;
}

const InlineReservationsPanel = ({ restaurantId, restaurantName, onBack }: InlineReservationsPanelProps) => {
  const { reservations, isLoading, updateReservationStatus, refetch } = useTableReservations(restaurantId);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<TableReservation | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<'pending' | 'confirmed' | 'cancelled'>('pending');

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try { await refetch(); } finally { setIsRefreshing(false); }
  };

  const handleOpenStatusDialog = (reservation: TableReservation) => {
    setSelectedReservation(reservation);
    setNewStatus(reservation.status || 'pending');
    setIsStatusDialogOpen(true);
  };

  const handleUpdateStatus = () => {
    if (selectedReservation && newStatus) {
      updateReservationStatus({ id: selectedReservation.id, status: newStatus });
      setIsStatusDialogOpen(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try { return format(new Date(dateStr), 'dd MMM yyyy', { locale: fr }); } catch { return dateStr; }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge className="bg-green-100 text-green-800 border-green-200">Confirmée</Badge>;
      case 'cancelled': return <Badge className="bg-red-100 text-red-800 border-red-200">Annulée</Badge>;
      default: return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">En attente</Badge>;
    }
  };

  return (
    <TooltipProvider>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour
            </Button>
            <h3 className="text-lg font-semibold">{restaurantName} — Réservations</h3>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {isLoading || isRefreshing ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : reservations && reservations.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Couverts</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="font-medium cursor-default">{reservation.guestName || 'Client'}</span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="space-y-1 text-xs">
                              {reservation.guestEmail && <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{reservation.guestEmail}</div>}
                              {reservation.guestPhone && <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{reservation.guestPhone}</div>}
                              {!reservation.guestEmail && !reservation.guestPhone && <span>Aucune info de contact</span>}
                            </TooltipContent>
                          </Tooltip>
                          {reservation.roomNumber && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Home className="h-3 w-3" /> Ch. {reservation.roomNumber}
                            </div>
                          )}
                        </div>
                        {reservation.specialRequests && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 cursor-default" />
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-[250px] text-xs">{reservation.specialRequests}</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(reservation.date)}</TableCell>
                    <TableCell>{reservation.time}</TableCell>
                    <TableCell>{reservation.guests}</TableCell>
                    <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenStatusDialog(reservation)}>Modifier</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucune réservation pour ce restaurant</p>
          </div>
        )}

        <StatusDialog
          isOpen={isStatusDialogOpen}
          onOpenChange={setIsStatusDialogOpen}
          reservation={selectedReservation}
          newStatus={newStatus}
          setNewStatus={setNewStatus}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </TooltipProvider>
  );
};

export default InlineReservationsPanel;
