
import { useState, useEffect, useCallback } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export function useRequestsData() {
  const { toast: uiToast } = useToast();
  const queryClient = useQueryClient();
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
    
    // Enable real-time subscription with improved config
    const channel = supabase
      .channel('service_requests_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'service_requests',
      }, (payload) => {
        console.log('Service request change detected:', payload.eventType, payload);
        
        // Refresh data immediately on any change
        refetch();
        
        // Show notification for new requests
        if (payload.eventType === 'INSERT') {
          uiToast({
            title: "Nouvelle requête",
            description: `Une nouvelle requête a été reçue.`,
            variant: "default"
          });
          
          // Also use Sonner toast for better visibility
          toast('Nouvelle requête', {
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
          
          uiToast({
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
          // Fall back to periodic refresh
          refetch();
        }
      });
    
    // Set up a periodic refresh as a backup
    const interval = setInterval(() => {
      console.log('Performing scheduled refresh of service requests');
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      refetch();
    }, 3000); // More frequent refresh (every 3 seconds)
    
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
      
      uiToast({
        title: "Données actualisées",
        description: "Les données des requêtes ont été actualisées."
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      uiToast({
        title: "Erreur",
        description: "Échec de l'actualisation des données.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, uiToast]);

  return {
    requests,
    isLoading,
    isRefreshing,
    isError,
    error,
    handleRefresh
  };
}
