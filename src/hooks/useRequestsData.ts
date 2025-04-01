
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
  
  // Set up real-time updates for service requests
  useEffect(() => {
    console.log('Setting up enhanced realtime updates for all service requests');
    
    // Force initial fetch
    refetch();
    
    // Enable realtime subscription with improved configuration
    const channel = supabase
      .channel('service_requests_realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'service_requests',
      }, (payload) => {
        console.log('Service request change detected:', payload.eventType, payload);
        
        // Immediately refetch data when any change occurs
        refetch();
        
        // Show notification for new requests
        if (payload.eventType === 'INSERT') {
          toast({
            title: "Nouvelle requête",
            description: `Une nouvelle requête a été reçue.`,
            variant: "default"
          });
          
          // Also use sonner toast for better visibility
          toast.success('Nouvelle requête', {
            description: 'Une nouvelle requête a été reçue'
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
        if (status !== 'SUBSCRIBED') {
          console.error('Failed to subscribe to realtime updates:', status);
          // Fallback to periodic refresh
          refetch();
        }
      });
    
    // Set up periodic refresh as a backup
    const interval = setInterval(() => {
      console.log('Performing scheduled refresh of service requests');
      refetch();
    }, 5000); // More frequent refresh (every 5 seconds)
    
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
