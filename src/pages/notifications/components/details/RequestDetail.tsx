
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationItem } from '@/types/notification';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Ban, CheckCircle2, Clock, FileText, Loader2, PhoneCall, Settings, ShowerHead, Shirt, Wifi, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RequestDetailProps {
  notification: NotificationItem;
}

export const RequestDetail: React.FC<RequestDetailProps> = ({ notification }) => {
  const navigate = useNavigate();
  const { cancelRequest, isCancelling } = useServiceRequests();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  
  const handleCancelRequest = async () => {
    try {
      await cancelRequest(notification.id);
      toast.success("Votre demande a été annulée");
      setIsCancelDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'annulation de la demande");
      console.error("Error cancelling request:", error);
    }
  };
  
  // Get status information
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return "Complétée";
      case 'in_progress': return "En cours";
      case 'cancelled': return "Annulée";
      default: return "En attente";
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed': return "bg-green-100 text-green-800";
      case 'in_progress': return "bg-blue-100 text-blue-800";
      case 'cancelled': return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'in_progress':
        return <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />;
      case 'cancelled':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-yellow-500" />;
    }
  };
  
  // Get request type icon
  const getTypeIcon = (serviceType?: string) => {
    if (!serviceType) return <FileText className="h-6 w-6" />;
    
    switch (serviceType) {
      case 'housekeeping':
        return <ShowerHead className="h-6 w-6" />;
      case 'laundry':
        return <Shirt className="h-6 w-6" />;
      case 'wifi':
        return <Wifi className="h-6 w-6" />;
      case 'bill':
        return <FileText className="h-6 w-6" />;
      case 'preferences':
        return <Settings className="h-6 w-6" />;
      case 'concierge':
        return <PhoneCall className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };
  
  const getTypeText = (serviceType?: string) => {
    if (!serviceType) return "Service";
    
    switch (serviceType) {
      case 'housekeeping': return "Service de chambre";
      case 'laundry': return "Service de blanchisserie";
      case 'wifi': return "Assistance WiFi";
      case 'bill': return "Demande de facture";
      case 'preferences': return "Préférences";
      case 'concierge': return "Service de conciergerie";
      default: return serviceType || "Service";
    }
  };
  
  const isPending = notification.status === 'pending';
  const isInProgress = notification.status === 'in_progress';
  const isCompleted = notification.status === 'completed';
  const isCancelled = notification.status === 'cancelled';
  const canCancel = ['pending', 'in_progress'].includes(notification.status);
  const creationDate = notification.time || new Date();
  
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-full">
                {getTypeIcon(notification.data?.service_type)}
              </div>
              <CardTitle>{getTypeText(notification.data?.service_type)}</CardTitle>
            </div>
            <Badge className={getStatusClass(notification.status)}>{getStatusText(notification.status)}</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {notification.description && (
            <div className="text-gray-600">
              <p>{notification.description}</p>
            </div>
          )}
          
          {notification.data?.room_number && (
            <div className="text-sm">
              <span className="font-medium">Chambre:</span> {notification.data.room_number}
            </div>
          )}
          
          <div className="text-sm text-gray-500">
            Demande créée {formatDistanceToNow(creationDate, { addSuffix: true, locale: fr })}
          </div>
          
          <div className="pt-4">
            {isPending && (
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Demande en attente</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Votre demande est en cours de traitement. Notre équipe s'en occupera dans les plus brefs délais.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {isInProgress && (
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Demande en cours</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Notre équipe est en train de traiter votre demande.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {isCompleted && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Demande complétée</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Votre demande a été traitée avec succès.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {isCancelled && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Demande annulée</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>Cette demande a été annulée.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 flex gap-3">
          <Button variant="outline" onClick={() => navigate('/my-room')}>
            Retour à ma chambre
          </Button>
          
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
            <DialogTitle>Annuler votre demande</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler cette demande de service ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Non, garder ma demande
            </Button>
            <Button variant="destructive" onClick={handleCancelRequest} disabled={isCancelling}>
              {isCancelling ? 'Annulation...' : 'Oui, annuler'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
