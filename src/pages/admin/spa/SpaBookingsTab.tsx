
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Calendar, Clock, User, Phone, Mail, MapPin, FileText, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useSpaBookings } from '@/hooks/useSpaBookings';
import { useSpaServices } from '@/hooks/useSpaServices';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { SpaBooking } from '@/features/spa/types';

export default function SpaBookingsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [serviceNames, setServiceNames] = useState<Record<string, string>>({});

  const { bookings, isLoading, updateBookingStatus, refetch } = useSpaBookings();

  React.useEffect(() => {
    const loadServiceNames = async () => {
      setIsLoadingServices(true);
      try {
        const { data, error } = await supabase
          .from('spa_bookings')
          .select(`
            id,
            service_id,
            spa_services:service_id (
              name
            )
          `);

        if (error) throw error;

        const servicesMap: Record<string, string> = {};
        data.forEach((booking: any) => {
          if (booking.service_id && booking.spa_services?.name) {
            servicesMap[booking.service_id] = booking.spa_services.name;
          }
        });

        setServiceNames(servicesMap);
      } catch (error) {
        console.error('Error loading service names:', error);
        toast.error('Erreur lors du chargement des noms de services');
      } finally {
        setIsLoadingServices(false);
      }
    };

    loadServiceNames();
  }, [bookings]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus({ id: bookingId, status: newStatus });
      toast.success('Statut mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
      console.error('Error updating status:', error);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await updateBookingStatus({ id: bookingId, status: 'cancelled' });
      toast.success('Réservation annulée avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'annulation de la réservation');
      console.error('Error canceling booking:', error);
    }
  };

  const filteredBookings = bookings.filter((booking: SpaBooking & { spa_services?: { name: string } }) => {
    const matchesSearch = 
      (booking.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       booking.guest_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       booking.room_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (serviceNames[booking.service_id] || booking.spa_services?.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    const matchesDate = !dateFilter || booking.date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'cancelled': return 'Annulée';
      case 'completed': return 'Terminée';
      default: return status;
    }
  };

  const renderBookingCard = (booking: SpaBooking & { spa_services?: { name: string } }) => {
    const bookingDate = new Date(booking.date);
    const formattedDate = format(bookingDate, 'EEEE d MMMM yyyy', { locale: fr });
    const serviceName = serviceNames[booking.service_id] || booking.spa_services?.name || 'Service inconnu';
    
    return (
      <Card key={booking.id} className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg">Réservation #{booking.id.substring(0, 8)}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">{serviceName}</div>
          </div>
          <Badge className={getStatusBadgeColor(booking.status)}>
            {getStatusText(booking.status)}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{booking.time}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{booking.guest_name}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{booking.guest_email}</span>
              </div>
              {booking.guest_phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{booking.guest_phone}</span>
                </div>
              )}
              {booking.room_number && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Chambre {booking.room_number}</span>
                </div>
              )}
            </div>
          </div>
          
          {booking.special_requests && (
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Demandes spéciales</span>
              </div>
              <p className="text-sm text-muted-foreground">{booking.special_requests}</p>
            </div>
          )}
          
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
              <>
                <Label className="text-sm mr-2">Statut:</Label>
                <Select
                  defaultValue={booking.status}
                  onValueChange={(value) => handleStatusChange(booking.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sélectionner le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmée</SelectItem>
                    <SelectItem value="completed">Terminée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
            
            {booking.status === 'pending' && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleCancelBooking(booking.id)}
                className="ml-auto"
              >
                Annuler
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Réservations Spa</h2>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="search" className="text-sm">Recherche</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Nom, email, chambre..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="status-filter" className="text-sm">Statut</Label>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmées</SelectItem>
              <SelectItem value="completed">Terminées</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="date-filter" className="text-sm">Date</Label>
          <Input
            id="date-filter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading || isLoadingServices ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Chargement des réservations...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucune réservation trouvée</p>
        </div>
      ) : (
        <div>
          {filteredBookings.map(renderBookingCard)}
        </div>
      )}
    </div>
  );
}
