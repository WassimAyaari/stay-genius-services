
import { useState, useEffect } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequestType } from '@/features/types/supabaseTypes';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

export function useRequestsData(categoryFilter?: string) {
  const { toast } = useToast();
  const { user, userData } = useAuth();
  
  const { 
    data: allRequests = [], 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useServiceRequests();
  
  // Filter requests by category if a category filter is provided
  const requests = categoryFilter 
    ? allRequests.filter(req => req.type === categoryFilter)
    : allRequests;
    
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Configure real-time updates for service requests
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
          
          // For non-admin users, check if the request belongs to them
          if (!window.location.pathname.includes('/admin')) {
            const userId = user?.id || localStorage.getItem('user_id');
            const roomNumber = userData?.room_number || localStorage.getItem('user_room_number');
            
            // Check if the request belongs to this user (by guest_id or room_number)
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
          
          // If a category filter is active, only refresh for matching category updates
          if (categoryFilter) {
            const payloadNew = payload.new as ServiceRequestType | null;
            if (payloadNew && payloadNew.type !== categoryFilter) {
              console.log(`Ignoring update for non-matching category: ${payloadNew.type}, filter: ${categoryFilter}`);
              return;
            }
          }
          
          refetch();
          
          // Show notification for status updates
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
  }, [refetch, toast, user?.id, userData?.room_number, categoryFilter]);
  
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
