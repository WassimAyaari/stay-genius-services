import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ServiceRequest } from '@/features/rooms/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { RequestDetailsCard } from '@/components/my-room/RequestDetailsCard';
import { CancelRequestDialog } from '@/components/my-room/CancelRequestDialog';
import { getServiceTypeText } from '@/components/my-room/ServiceTypeIcon';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const ServiceRequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: serviceRequests, cancelRequest, isLoading: isLoadingRequests, refetch } = useServiceRequests();
  
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    if (!id) {
      toast.error("Identifiant de demande manquant");
      navigate('/notifications');
      return;
    }
    
    const foundRequest = serviceRequests?.find(r => r.id === id);
    if (foundRequest) {
      setRequest(foundRequest);
    } else if (!isLoadingRequests) {
      toast.error("Demande non trouvée");
      navigate('/notifications');
    }
  }, [id, serviceRequests, navigate, isLoadingRequests]);
  
  useEffect(() => {
    if (!id) return;
    
    console.log(`Setting up real-time updates for request ${id}`);
    
    refetch();
    
    const requestChannel = supabase
      .channel(`request-details-${id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'service_requests',
        filter: `id=eq.${id}`
      }, (payload) => {
        console.log('Request update detected:', payload);
        
        if (payload.new) {
          const updatedRequest = {...request, ...payload.new};
          setRequest(updatedRequest);
          
          if (payload.old?.status !== payload.new.status) {
            const statusMap = {
              'pending': 'en attente',
              'in_progress': 'en cours',
              'completed': 'complétée',
              'cancelled': 'annulée'
            };
            
            const status = payload.new.status;
            const statusText = statusMap[status] || status;
            
            toast.info(`Statut mis à jour`, {
              description: `Votre demande est maintenant ${statusText}`
            });
          }
          
          queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
        }
      })
      .subscribe();
    
    return () => {
      console.log(`Cleaning up real-time subscription for request ${id}`);
      supabase.removeChannel(requestChannel);
    };
  }, [id, refetch, queryClient, request]);
  
  const handleCancelRequest = async () => {
    if (!request) return;
    
    setIsUpdating(true);
    try {
      await cancelRequest(request.id);
      toast.success("Votre demande a été annulée");
      setIsCancelDialogOpen(false);
      
      if (request) {
        setRequest({
          ...request,
          status: 'cancelled'
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    } catch (error) {
      toast.error("Erreur lors de l'annulation de la demande");
      console.error("Erreur lors de l'annulation:", error);
    } finally {
      setIsUpdating(false);
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
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Détails de votre demande</h1>
        
        <RequestDetailsCard
          request={request}
          onCancel={() => setIsCancelDialogOpen(true)}
          onBackClick={() => navigate('/my-room')}
        />
      </div>
      
      <CancelRequestDialog
        isOpen={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        onConfirm={handleCancelRequest}
        isLoading={isUpdating}
        serviceName={getServiceTypeText(request.type)}
      />
    </Layout>
  );
};

export default ServiceRequestDetails;
