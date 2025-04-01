
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
    refetch,
    createTestRequestIfEmpty
  } = useServiceRequests();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Configurer les mises à jour en temps réel pour les demandes de service
  useEffect(() => {
    console.log('Setting up enhanced realtime updates for all service requests');
    
    // Forcer les actualisations initiales multiples pour s'assurer que les données sont chargées
    refetch();
    
    // Vérifier et créer une requête de test si nécessaire (mode démo)
    setTimeout(() => {
      createTestRequestIfEmpty();
    }, 1000);
    
    setTimeout(() => refetch(), 2000);
    
    // Abonnement en temps réel principal - optimisé pour la fiabilité
    const serviceRequestsChannel = supabase
      .channel('service_requests_all_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'service_requests',
      }, (payload) => {
        console.log('Service request change detected:', payload.eventType, payload);
        
        // Actualiser les données immédiatement à tout changement
        refetch();
        
        // Afficher une notification pour les nouvelles demandes
        if (payload.eventType === 'INSERT') {
          uiToast({
            title: "Nouvelle requête",
            description: `Une nouvelle requête a été reçue.`,
            variant: "default"
          });
          
          // Utiliser également le toast Sonner pour une meilleure visibilité
          toast('Nouvelle requête', {
            description: 'Une nouvelle requête a été reçue'
          });
          
          // Forcer l'actualisation
          queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
          queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
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
          
          // Utiliser également le toast Sonner pour une meilleure visibilité
          toast('Statut mis à jour', {
            description: `La requête ${message}`
          });
          
          // Forcer l'actualisation
          queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
          queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
        }
      })
      .subscribe((status) => {
        console.log('Enhanced subscription status:', status);
        if (status !== 'SUBSCRIBED') {
          console.error('Failed to subscribe to realtime updates:', status);
        }
      });
      
    // Écouteur de diffusion pour les notifications de soumission
    const notificationChannel = supabase
      .channel('service_requests_notifications')
      .on('broadcast', { event: 'request_submitted' }, (payload) => {
        console.log('Request submission notification received:', payload);
        // Forcer l'actualisation lorsqu'une notification de soumission de demande est reçue
        refetch();
        queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      })
      .subscribe();
    
    // Configurer une actualisation fréquente comme sauvegarde supplémentaire
    const interval = setInterval(() => {
      console.log('Performing scheduled refresh of service requests');
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      refetch();
    }, 5000);
    
    return () => {
      console.log('Cleaning up realtime subscription and interval');
      supabase.removeChannel(serviceRequestsChannel);
      supabase.removeChannel(notificationChannel);
      clearInterval(interval);
    };
  }, [refetch, queryClient, uiToast, createTestRequestIfEmpty]);
  
  const handleRefresh = useCallback(async () => {
    console.log('Manual refresh of service requests triggered');
    setIsRefreshing(true);
    try {
      await createTestRequestIfEmpty();
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
  }, [refetch, uiToast, createTestRequestIfEmpty]);

  return {
    requests,
    isLoading,
    isRefreshing,
    isError,
    error,
    handleRefresh
  };
}
