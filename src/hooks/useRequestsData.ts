
import { useState, useEffect } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/features/rooms/types';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

export function useRequestsData() {
  const { toast } = useToast();
  const { user } = useAuth();
  // Directly use the return values from useServiceRequests
  const { 
    data: requests = [], 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useServiceRequests();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Set up real-time updates for all service requests
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
              description: `Request ${message}.`
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
      
      // Also manually fetch the latest data to ensure we have everything
      const { data: latestRequests, error: fetchError } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (fetchError) {
        console.error("Error manually fetching requests:", fetchError);
      } else {
        console.log(`Manually fetched ${latestRequests?.length || 0} service requests`);
      }
      
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
