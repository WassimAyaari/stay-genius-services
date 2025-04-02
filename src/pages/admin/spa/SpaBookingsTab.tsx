
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RefreshCw, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SpaBookingsTab = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('spa_bookings')
        .select(`
          *,
          spa_services:service_id (name, price, duration, category),
          spa_facilities:facility_id (name, location)
        `)
        .order('date', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les réservations",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleRefresh = () => {
    fetchBookings();
  };

  const handleOpenStatusDialog = (booking: any) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setIsStatusDialogOpen(true);
  };

  const handleOpenCancelDialog = (booking: any) => {
    setSelectedBooking(booking);
    setIsCancelDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedBooking || !newStatus) return;

    try {
      const { error } = await supabase
        .from('spa_bookings')
        .update({ status: newStatus })
        .eq('id', selectedBooking.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Statut mis à jour avec succès",
      });

      fetchBookings();
      setIsStatusDialogOpen(false);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      const { error } = await supabase
        .from('spa_bookings')
        .update({ status: 'cancelled' })
        .eq('id', selectedBooking.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Réservation annulée avec succès",
      });

      fetchBookings();
      setIsCancelDialogOpen(false);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'annuler la réservation",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmée</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Complétée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (searchQuery === '') return true;
    
    const searchTerms = searchQuery.toLowerCase();
    return (
      booking.guest_name?.toLowerCase().includes(searchTerms) ||
      booking.guest_email?.toLowerCase().includes(searchTerms) ||
      booking.room_number?.toLowerCase().includes(searchTerms) ||
      booking.spa_services?.name?.toLowerCase().includes(searchTerms)
    );
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <Select
            value={statusFilter}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmée</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="completed">Complétée</SelectItem>
              <SelectItem value="cancelled">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="w-full md:w-auto"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Aucune réservation trouvée</p>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Chambre</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.spa_services?.name || 'Service inconnu'}
                      <p className="text-xs text-muted-foreground">
                        {booking.spa_facilities?.name || 'Installation inconnue'}
                      </p>
                    </TableCell>
                    <TableCell>
                      {booking.date ? format(parseISO(booking.date), 'P', { locale: fr }) : '-'}
                    </TableCell>
                    <TableCell>{booking.time || '-'}</TableCell>
                    <TableCell>
                      <div className="font-medium">{booking.guest_name}</div>
                      <div className="text-xs text-muted-foreground">{booking.guest_email}</div>
                    </TableCell>
                    <TableCell>{booking.room_number || '-'}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenStatusDialog(booking)}
                          disabled={booking.status === 'cancelled'}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Statut
                        </Button>
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenCancelDialog(booking)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Annuler
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mettre à jour le statut</DialogTitle>
            <DialogDescription>
              Modifier le statut de la réservation pour {selectedBooking?.spa_services?.name || 'ce service'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                    En attente
                  </div>
                </SelectItem>
                <SelectItem value="confirmed">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                    Confirmée
                  </div>
                </SelectItem>
                <SelectItem value="in_progress">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    En cours
                  </div>
                </SelectItem>
                <SelectItem value="completed">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Complétée
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleStatusUpdate}>
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la réservation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler cette réservation ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelBooking} className="bg-red-600 hover:bg-red-700">
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SpaBookingsTab;
