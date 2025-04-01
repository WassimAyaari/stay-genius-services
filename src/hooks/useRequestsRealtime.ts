
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useRequestsRealtime(onNewRequests: () => void) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    console.log('Setting up admin real-time updates for service requests');
    
    // Configurer un abonnement en temps réel dédié spécifiquement pour la page d'administration
    const channel = supabase
      .channel('admin-requests-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'service_requests',
      }, (payload) => {
        console.log('Admin detected service request change:', payload);
        
        // Signaler que de nouvelles demandes sont disponibles
        onNewRequests();
        
        // Afficher une notification en fonction du type d'événement
        if (payload.eventType === 'INSERT') {
          const data = payload.new;
          const requestType = data.type || 'service';
          const roomNumber = data.room_number || 'Unknown';
          
          toast.success('Nouvelle demande reçue', {
            description: `Nouvelle demande de ${requestType} depuis la chambre ${roomNumber}`
          });
          
          // Forcer l'actualisation immédiate des données
          queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
          queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
        } else if (payload.eventType === 'UPDATE') {
          toast.info('Demande mise à jour', {
            description: 'Une demande a été modifiée'
          });
          
          // Forcer l'actualisation
          queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
        }
      })
      .subscribe((status) => {
        console.log('Admin real-time subscription status:', status);
        if (status !== 'SUBSCRIBED') {
          console.error('Failed to subscribe to realtime updates, falling back to polling');
        }
      });
      
    // Écouter les événements de diffusion pour les mises à jour de statut
    const statusChannel = supabase
      .channel('status-updates-listener')
      .on('broadcast', { event: 'status_updated' }, (payload) => {
        console.log('Status update broadcast received:', payload);
        
        // Forcer l'actualisation immédiate
        queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
        queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
        
        // Afficher une notification toast
        const statusMap = {
          'pending': 'en attente',
          'in_progress': 'en cours',
          'completed': 'complétée',
          'cancelled': 'annulée'
        };
        
        const status = payload.payload.newStatus;
        const statusText = statusMap[status] || status;
        
        toast.info('Statut mis à jour', {
          description: `Demande ${payload.payload.requestId.substring(0, 8)}... maintenant ${statusText}`
        });
      })
      .subscribe();
    
    // Configurer un intervalle de sondage fréquent comme sauvegarde
    const pollingInterval = setInterval(() => {
      console.log('Performing polling refresh of service requests');
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    }, 5000);
    
    return () => {
      clearInterval(pollingInterval);
      supabase.removeChannel(channel);
      supabase.removeChannel(statusChannel);
    };
  }, [queryClient, onNewRequests]);
}
