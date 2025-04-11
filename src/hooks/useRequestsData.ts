
import { useState, useEffect } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/features/rooms/types';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { ServiceRequestType } from '@/features/types/supabaseTypes';

export function useRequestsData() {
  const { toast } = useToast();
  const { user, userData } = useAuth();
  // Directement utiliser les valeurs retournées par useServiceRequests
  const { 
    data: requests = [], 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useServiceRequests();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Configuration des mises à jour en temps réel pour toutes les demandes de service
  useEffect(() => {
    try {
      const channel = supabase
        .channel('service_requests_updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'service_requests',
        }, (payload) => {
          console.log('Service request change detected:', payload);
          
          // Pour les utilisateurs non-admin, vérifier si la requête leur appartient
          if (!window.location.pathname.includes('/admin')) {
            const userId = user?.id || localStorage.getItem('user_id');
            const roomNumber = userData?.room_number || localStorage.getItem('user_room_number');
            
            // Vérifier si la requête appartient à cet utilisateur (par guest_id ou room_number)
            // Type guard to ensure payload.new exists and has the expected properties
            const payloadNew = payload.new as ServiceRequestType | null;
            
            if (!payloadNew) {
              console.log('Payload new is null or undefined');
              return;
            }
            
            const isUserRequest = 
              (payloadNew.guest_id === userId) || 
              (roomNumber && payloadNew.room_number === roomNumber);
            
            if (!isUserRequest) {
              console.log('Ignoring update for request not belonging to current user');
              return;
            }
          }
          
          refetch();
          
          // Afficher une notification pour les mises à jour de statut
          if (payload.eventType === 'UPDATE') {
            const payloadNew = payload.new as ServiceRequestType | null;
            const payloadOld = payload.old as ServiceRequestType | null;
            
            if (payloadNew && payloadOld && payloadNew.status !== payloadOld.status) {
              const statusMap = {
                'pending': 'is now pending',
                'in_progress': 'is now in progress',
                'completed': 'has been completed',
                'cancelled': 'has been cancelled'
              };
              
              const status = payloadNew.status;
              const message = statusMap[status] || 'has been updated';
              
              toast({
                title: "Request Update",
                description: `Request ${message}.`
              });
            }
          }
        })
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error("Error setting up realtime updates:", error);
    }
  }, [refetch, toast, user?.id, userData?.room_number]);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      
      toast({
        title: "Data Refreshed",
        description: "Request data has been refreshed."
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Error",
        description: "Failed to refresh request data.",
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
