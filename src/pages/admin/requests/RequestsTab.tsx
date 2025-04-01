
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceRequestWithItem } from './types';
import { RequestsTable } from '@/components/admin/requests/RequestsTable';
import { useRequestsData } from '@/hooks/useRequestsData';
import { useRequestStatusService } from '@/features/requests/services/requestStatusService';
import { RequestsHeader } from '@/components/admin/requests/RequestsHeader';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const RequestsTab = () => {
  const { 
    requests, 
    isLoading, 
    isRefreshing, 
    isError,
    error,
    handleRefresh 
  } = useRequestsData();
  
  const { handleUpdateStatus } = useRequestStatusService();
  const queryClient = useQueryClient();
  const [newRequests, setNewRequests] = useState<boolean>(false);
  
  // Forcer un rafraîchissement lorsque le composant est monté
  useEffect(() => {
    console.log('RequestsTab mounted, forcing refresh of data');
    
    // Forcer plusieurs rafraîchissements pour s'assurer que les données sont chargées
    handleRefresh();
    
    const initialRefreshes = [100, 500, 1500, 3000].map(delay => 
      setTimeout(() => {
        console.log(`Performing delayed refresh after ${delay}ms`);
        queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
        queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
      }, delay)
    );
    
    // Mettre en place une souscription en temps réel dédiée pour la page d'administration
    const channel = supabase
      .channel('admin-requests-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'service_requests',
      }, (payload) => {
        console.log('Admin detected service request change:', payload);
        
        // Signaler que de nouvelles demandes sont disponibles
        setNewRequests(true);
        
        // Afficher une notification pour les changements
        if (payload.eventType === 'INSERT') {
          toast.success('Nouvelle demande reçue', {
            description: 'Une nouvelle demande a été ajoutée au système'
          });
        } else if (payload.eventType === 'UPDATE') {
          toast.info('Demande mise à jour', {
            description: 'Une demande a été modifiée'
          });
        }
        
        // Forcer le rafraîchissement immédiat des données
        queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
        queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
      })
      .subscribe((status) => {
        console.log('Admin real-time subscription status:', status);
      });
    
    // Configurer un intervalle de rafraîchissement fréquent comme sauvegarde
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
    }, 3000);
    
    return () => {
      initialRefreshes.forEach(clearTimeout);
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [queryClient, handleRefresh]);
  
  // Effet pour rafraîchir automatiquement lorsque de nouvelles demandes sont détectées
  useEffect(() => {
    if (newRequests) {
      console.log('New requests detected, refreshing data');
      handleRefresh();
      setNewRequests(false);
    }
  }, [newRequests, handleRefresh]);
  
  const onUpdateStatus = async (requestId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    await handleUpdateStatus(requestId, newStatus, () => {
      // Forcer plusieurs rafraîchissements pour s'assurer que les données sont mises à jour
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
      }, 300);
      setTimeout(() => {
        handleRefresh();
      }, 800);
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <RequestsHeader 
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {isError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load request data. Please try refreshing.
              {error && <div className="mt-2 text-xs opacity-80">{String(error)}</div>}
            </AlertDescription>
          </Alert>
        )}

        <RequestsTable 
          requests={requests as ServiceRequestWithItem[]} 
          isLoading={isLoading || isRefreshing} 
          onUpdateStatus={onUpdateStatus}
        />
      </CardContent>
    </Card>
  );
};
