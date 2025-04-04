
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationItem } from '@/types/notification';
import { useTableReservations } from '@/hooks/useTableReservations';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Ban, Calendar, Clock, Users, Utensils } from 'lucide-react';
import { toast } from 'sonner';

interface ReservationDetailProps {
  notification: NotificationItem;
}

export const ReservationDetail: React.FC<ReservationDetailProps> = ({ notification }) => {
  const navigate = useNavigate();
  const { cancelReservation } = useTableReservations();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleCancelReservation = async () => {
    if (!notification.id) return;
    
    setIsUpdating(true);
    try {
      await cancelReservation(notification.id);
      toast.success("Votre réservation a été annulée");
      setIsCancelDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'annulation de la réservation");
      console.error("Error cancelling reservation:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Get status information
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return "Confirmée";
      case 'cancelled': return "Annulée";
      case 'completed': return "Complétée";
      case 'in_progress': return "En cours";
      default: return "En attente";
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed': return "bg-green-100 text-green-800";
      case 'cancelled': return "bg-red-100 text-red-800";
      case 'in_progress': return "bg-blue-100 text-blue-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };
  
  const isPending = notification.status === 'pending';
  const isConfirmed = notification.status === 'confirmed';
  const canCancel = ['pending', 'confirmed'].includes(notification.status);
  const canModify = notification.status === 'pending';
  const creationDate = notification.time || new Date();
  
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle>Réservation Restaurant</CardTitle>
            <Badge className={getStatusClass(notification.status)}>{getStatusText(notification.status)}</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-4">Détails de la réservation</h3>
            
            <div className="space-y-3">
              {notification.data?.date && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Date: {notification.data.date}</span>
                </div>
              )}
              
              {notification.data?.time && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Heure: {notification.data.time}</span>
                </div>
              )}
              
              {notification.data?.guests && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Personnes: {notification.data.guests}</span>
                </div>
              )}
              
              {notification.data?.restaurant && (
                <div className="flex items-center">
                  <Utensils className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Restaurant: {notification.data.restaurant}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Réservation créée {formatDistanceToNow(creationDate, { addSuffix: true, locale: fr })}
          </div>
          
          {isPending && (
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Réservation en attente</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Votre réservation est en attente de confirmation par le restaurant.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-2 flex gap-3">
          <Button variant="outline" onClick={() => navigate('/dining')}>
            Voir les restaurants
          </Button>
          
          {canModify && (
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => navigate(`/dining/edit-reservation/${notification.id}`)}
            >
              Modifier
            </Button>
          )}
          
          {canCancel && (
            <Button 
              variant="destructive" 
              className="gap-2"
              onClick={() => setIsCancelDialogOpen(true)}
            >
              <Ban className="h-4 w-4" />
              Annuler
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Confirmation dialog for cancellation */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Annuler votre réservation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler cette réservation au restaurant ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Non, garder ma réservation
            </Button>
            <Button variant="destructive" onClick={handleCancelReservation} disabled={isUpdating}>
              {isUpdating ? 'Annulation...' : 'Oui, annuler'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
