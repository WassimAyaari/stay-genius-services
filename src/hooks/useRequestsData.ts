
import { useState, useEffect } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/features/rooms/types';

export function useRequestsData() {
  const { toast } = useToast();
  const { 
    data: requests = [], 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useServiceRequests();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Set up real-time updates for service requests
  useEffect(() => {
    console.log('Setting up realtime updates for all service requests');
    
    // Enable realtime subscription to all changes in service_requests table
    const channel = supabase
      .channel('service_requests_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'service_requests',
      }, (payload) => {
        console.log('Service request change detected:', payload);
        
        // Immediately refetch data when any change occurs
        refetch();
        
        // Show notification for new requests
        if (payload.eventType === 'INSERT') {
          toast({
            title: "Nouvelle requête",
            description: `Une nouvelle requête ${payload.new.type} a été reçue.`,
            variant: "default"
          });
        }
        
        // Show notification for status updates
        if (payload.eventType === 'UPDATE' && payload.new?.status !== payload.old?.status) {
          const statusMap = {
            'pending': 'est en attente',
            'in_progress': 'est en cours',
            'completed': 'a été complétée',
            'cancelled': 'a été annulée'
          };
          
          const status = payload.new.status;
          const message = statusMap[status] || 'a été mise à jour';
          
          toast({
            title: "Mise à jour",
            description: `La requête ${payload.new.type} ${message}.`,
            variant: "default"
          });
        }
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });
    
    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      
      toast({
        title: "Données actualisées",
        description: "Les données des requêtes ont été actualisées."
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Erreur",
        description: "Échec de l'actualisation des données.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    requests,
    isLoading,
    isRefreshing,
    isError,
    error,
    handleRefresh
  };
}
