
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
    // Only setup realtime if we have user data
    const userData = localStorage.getItem('user_data');
    if (!userData) return;
    
    try {
      const userInfo = JSON.parse(userData);
      const userId = localStorage.getItem('user_id');
      if (!userId) return;
      
      const channel = supabase
        .channel('service_requests_updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'service_requests',
          filter: `guest_id=eq.${userId}`,
        }, (payload) => {
          console.log('Service request change detected:', payload);
          refetch();
          
          // Show notification for status updates
          if (payload.eventType === 'UPDATE' && payload.new?.status !== payload.old?.status) {
            const statusMap = {
              'pending': 'is now pending',
              'in_progress': 'is now in progress',
              'completed': 'has been completed',
              'cancelled': 'has been cancelled'
            };
            
            const status = payload.new.status;
            const message = statusMap[status] || 'has been updated';
            
            toast({
              title: "Request Update",
              description: `Your ${payload.new.type} request ${message}.`
            });
          }
        })
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error("Error setting up realtime updates:", error);
    }
  }, [refetch, toast]);
  
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
