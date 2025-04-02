
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle2, XCircle, Clock, Loader2, ShowerHead, Shirt, PhoneCall, Wifi, FileText, Settings, Search, Ban } from 'lucide-react';
import { toast } from 'sonner';
import { ServiceRequest } from '@/features/rooms/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const ServiceRequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    data: serviceRequests = [], 
    cancelRequest, 
    isLoading: isLoadingRequests,
    isError
  } = useServiceRequests();
  
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    if (!id) {
      toast.error("Identifiant de demande manquant");
      navigate('/notifications');
      return;
    }
    
    // Only try to find the request if serviceRequests is defined and not empty
    if (serviceRequests && serviceRequests.length > 0) {
      const foundRequest = serviceRequests.find(r => r.id === id);
      if (foundRequest) {
        setRequest(foundRequest);
      } else {
        toast.error("Demande non trouvée");
        navigate('/notifications');
      }
    } else if (!isLoadingRequests && !isError) {
      // If we're not still loading but have no requests, show an error
      toast.error("Aucune demande disponible");
      navigate('/notifications');
    }
  }, [id, serviceRequests, navigate, isLoadingRequests, isError]);
  
  const handleCancelRequest = async () => {
    if (!request) return;
    
    setIsUpdating(true);
    try {
      await cancelRequest(request.id);
      toast.success("Votre demande a été annulée");
      setIsCancelDialogOpen(false);
      
      // Mettre à jour l'état local
      if (request) {
        setRequest({
          ...request,
          status: 'cancelled'
        });
      }
    } catch (error) {
      toast.error("Erreur lors de l'annulation de la demande");
      console.error("Erreur lors de l'annulation:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getStatusIcon = () => {
    if (!request) return null;
    
    switch (request.status) {
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
  
  const getStatusText = () => {
    if (!request) return "";
    
    switch (request.status) {
      case 'completed': return "Complétée";
      case 'in_progress': return "En cours";
      case 'cancelled': return "Annulée";
      default: return "En attente";
    }
  };
  
  const getStatusClass = () => {
    if (!request) return "";
    
    switch (request.status) {
      case 'completed': return "bg-green-100 text-green-800";
      case 'in_progress': return "bg-blue-100 text-blue-800";
      case 'cancelled': return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };
  
  const getTypeIcon = () => {
    if (!request) return <Search className="h-6 w-6" />;
    
    switch (request.type) {
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
        return <Search className="h-6 w-6" />;
    }
  };
  
  const getTypeText = () => {
    if (!request) return "";
    
    switch (request.type) {
      case 'housekeeping': return "Service de chambre";
      case 'laundry': return "Service de blanchisserie";
      case 'wifi': return "Assistance WiFi";
      case 'bill': return "Demande de facture";
      case 'preferences': return "Préférences";
      case 'concierge': return "Service de conciergerie";
      default: return request.type || "Service";
    }
  };
  
  if (isLoadingRequests) {
    return (
      <Layout>
        <div className="container py-8 flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
        </div>
      </Layout>
    );
  }
  
  if (isError) {
    return (
      <Layout>
        <div className="container py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Erreur lors du chargement des détails. Veuillez réessayer.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate('/notifications')}>
                Retour aux notifications
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!request) {
    return (
      <Layout>
        <div className="container py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Impossible de trouver les détails de cette demande.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate('/notifications')}>
                Retour aux notifications
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }
  
  const isPending = request.status === 'pending';
  const isInProgress = request.status === 'in_progress';
  const isCompleted = request.status === 'completed';
  const isCancelled = request.status === 'cancelled';
  const creationDate = new Date(request.created_at);
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Détails de votre demande</h1>
        
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  {getTypeIcon()}
                </div>
                <CardTitle>{getTypeText()}</CardTitle>
              </div>
              <Badge className={getStatusClass()}>{getStatusText()}</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {request.description && (
              <div className="text-gray-600">
                <p>{request.description}</p>
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
            
            {(isPending || isInProgress) && (
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
      </div>
      
      {/* Dialog de confirmation d'annulation */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Annuler votre demande</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler cette demande de {getTypeText().toLowerCase()} ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Non, garder ma demande
            </Button>
            <Button variant="destructive" onClick={handleCancelRequest} disabled={isUpdating}>
              {isUpdating ? 'Annulation...' : 'Oui, annuler'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ServiceRequestDetails;
