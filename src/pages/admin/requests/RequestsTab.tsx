
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceRequestWithItem } from './types';
import { RequestsTable } from '@/components/admin/requests/RequestsTable';
import { useRequestsData } from '@/hooks/useRequestsData';
import { useRequestStatusService } from '@/features/requests/services/requestStatusService';
import { RequestsHeader } from '@/components/admin/requests/RequestsHeader';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export const RequestsTab = () => {
  const queryClient = useQueryClient();
  const { 
    requests, 
    isLoading, 
    isRefreshing, 
    isError,
    error,
    handleRefresh 
  } = useRequestsData();
  
  const { handleUpdateStatus } = useRequestStatusService();
  const [newRequests, setNewRequests] = useState<boolean>(false);
  const [dataChecked, setDataChecked] = useState<boolean>(false);
  
  // Forcer plusieurs actualisations lorsque le composant est monté
  useEffect(() => {
    console.log('RequestsTab mounted, forcing aggressive refresh of data');
    
    // Actualisation immédiate
    handleRefresh();
    
    // Planifier plusieurs cycles d'actualisation pour s'assurer que les données sont chargées
    const refreshTimes = [500, 1500, 3000, 5000];
    const refreshTimers = refreshTimes.map(delay => 
      setTimeout(() => {
        console.log(`Performing delayed refresh after ${delay}ms`);
        queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
        queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
        
        // Considérer les données comme vérifiées après la dernière actualisation
        if (delay === refreshTimes[refreshTimes.length - 1]) {
          setDataChecked(true);
        }
      }, delay)
    );
    
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
        setNewRequests(true);
        
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
          handleRefresh();
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
      queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
    }, 5000);
    
    return () => {
      refreshTimers.forEach(clearTimeout);
      clearInterval(pollingInterval);
      supabase.removeChannel(channel);
      supabase.removeChannel(statusChannel);
    };
  }, [queryClient, handleRefresh]);
  
  // Effet pour actualiser automatiquement lorsque de nouvelles demandes sont détectées
  useEffect(() => {
    if (newRequests) {
      console.log('New requests detected, refreshing data');
      handleRefresh();
      setNewRequests(false);
    }
  }, [newRequests, handleRefresh]);
  
  const onUpdateStatus = async (requestId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    await handleUpdateStatus(requestId, newStatus, () => {
      // Forcer plusieurs actualisations pour s'assurer que les données sont mises à jour
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
      setTimeout(() => {
        handleRefresh();
      }, 500);
    });
  };

  const createRealisticRequests = async () => {
    try {
      // Définir différents types de requêtes réalistes
      const requestTypes = [
        {
          guest_id: 'guest-101',
          room_id: 'room-101',
          guest_name: 'Jean Dupont',
          room_number: '101',
          type: 'housekeeping',
          description: 'Demande de nettoyage quotidien',
          status: 'pending'
        },
        {
          guest_id: 'guest-102',
          room_id: 'room-102',
          guest_name: 'Marie Laforêt',
          room_number: '102',
          type: 'maintenance',
          description: 'Fuite d\'eau dans la salle de bain',
          status: 'in_progress'
        },
        {
          guest_id: 'guest-103',
          room_id: 'room-103',
          guest_name: 'Paul Martin',
          room_number: '103',
          type: 'concierge',
          description: 'Réservation de taxi pour 18h00',
          status: 'pending'
        }
      ];
      
      // Choisir aléatoirement une requête
      const randomRequest = requestTypes[Math.floor(Math.random() * requestTypes.length)];
      
      const { data, error } = await supabase
        .from('service_requests')
        .insert(randomRequest)
        .select();
        
      if (error) {
        console.error('Error creating realistic request:', error);
        toast.error('Erreur lors de la création de la requête de démonstration');
      } else {
        console.log('Created realistic request:', data);
        toast.success('Requête de démonstration créée avec succès');
        handleRefresh();
      }
    } catch (e) {
      console.error('Exception creating realistic request:', e);
    }
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
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Impossible de charger les données des requêtes. Veuillez réessayer.
              {error && <div className="mt-2 text-xs opacity-80">{String(error)}</div>}
            </AlertDescription>
          </Alert>
        )}
        
        {dataChecked && requests.length === 0 && !isLoading && !isRefreshing && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Aucune requête trouvée</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>Aucune requête n'est disponible dans la base de données.</p>
              <Button 
                variant="outline" 
                onClick={createRealisticRequests}
                className="w-fit"
              >
                Créer une requête réaliste
              </Button>
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
