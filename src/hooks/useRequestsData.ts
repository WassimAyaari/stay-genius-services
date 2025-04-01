
import { useState, useEffect, useCallback } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  
  // Set up real-time updates for service requests with improved reliability
  useEffect(() => {
    console.log('Setting up enhanced realtime updates for all service requests');
    
    // Enable realtime subscription to all changes in service_requests table
    const channel = supabase
      .channel('service_requests_enhanced_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'service_requests',
      }, (payload) => {
        console.log('Service request change detected with type:', payload.eventType);
        console.log('Service request payload:', payload);
        
        // Immediately refetch data when any change occurs
        refetch();
        
        // Show notification for new requests
        if (payload.eventType === 'INSERT') {
          toast({
            title: "Nouvelle requête",
            description: `Une nouvelle requête a été reçue.`,
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
            description: `La requête ${message}.`,
            variant: "default"
          });
        }
      })
      .subscribe((status) => {
        console.log('Enhanced subscription status:', status);
      });
    
    // Set up periodic refresh as a fallback
    const interval = setInterval(() => {
      console.log('Performing scheduled refresh of service requests');
      refetch();
    }, 10000); // Refresh every 10 seconds
    
    return () => {
      console.log('Cleaning up realtime subscription and interval');
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [refetch]);
  
  const handleRefresh = useCallback(async () => {
    console.log('Manual refresh of service requests triggered');
    setIsRefreshing(true);
    try {
      const result = await refetch();
      console.log('Manual refresh completed with count:', result.data?.length || 0);
      
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
  }, [refetch]);

  return {
    requests,
    isLoading,
    isRefreshing,
    isError,
    error,
    handleRefresh
  };
}
