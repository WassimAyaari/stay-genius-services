
import { useState, useEffect, useCallback } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useRequestsData() {
  const { toast: uiToast } = useToast();
  const { 
    data: requests = [], 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useServiceRequests();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Configuration des mises à jour en temps réel pour les requêtes de service
  useEffect(() => {
    console.log('Setting up enhanced realtime updates for all service requests');
    
    // Forcer la récupération initiale
    refetch();
    
    // Activer la souscription en temps réel avec une configuration améliorée
    const channel = supabase
      .channel('service_requests_realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'service_requests',
      }, (payload) => {
        console.log('Service request change detected:', payload.eventType, payload);
        
        // Rafraîchir immédiatement les données lors de tout changement
        refetch();
        
        // Afficher une notification pour les nouvelles demandes
        if (payload.eventType === 'INSERT') {
          uiToast({
            title: "Nouvelle requête",
            description: `Une nouvelle requête a été reçue.`,
            variant: "default"
          });
          
          // Utiliser également toast sonner pour une meilleure visibilité
          toast('Nouvelle requête', {
            description: 'Une nouvelle requête a été reçue'
          });
        }
        
        // Afficher une notification pour les mises à jour de statut
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
          // Repli sur un rafraîchissement périodique
          refetch();
        }
      });
    
    // Configurer un rafraîchissement périodique comme sauvegarde
    const interval = setInterval(() => {
      console.log('Performing scheduled refresh of service requests');
      refetch();
    }, 5000); // Rafraîchissement plus fréquent (toutes les 5 secondes)
    
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
