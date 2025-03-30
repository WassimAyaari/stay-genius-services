
import { useState, useEffect } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useToast } from '@/hooks/use-toast';
import { ServiceRequest } from '@/features/rooms/types';

export function useRequestsData() {
  const { toast } = useToast();
  const { data: dbRequests = [], isLoading, isError, refetch } = useServiceRequests();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Load and combine DB requests with localStorage requests
  useEffect(() => {
    const loadAllRequests = () => {
      try {
        // Get local requests
        const localRequestsStr = localStorage.getItem('pending_requests') || '[]';
        const localRequests = JSON.parse(localRequestsStr);
        
        // Transform local requests to match the format needed for display
        const transformedLocalRequests = localRequests.map((req: any) => ({
          ...req,
          id: req.id || `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          guest_name: localStorage.getItem('user_data') 
            ? JSON.parse(localStorage.getItem('user_data') || '{}').name || 'Guest'
            : 'Guest',
          room_number: localStorage.getItem('user_data')
            ? JSON.parse(localStorage.getItem('user_data') || '{}').roomNumber || 'Unknown'
            : 'Unknown',
          request_items: req.request_item_id ? { name: req.description || 'Request item' } : null
        }));
        
        console.log('Transformed local requests:', transformedLocalRequests);
        console.log('DB requests:', dbRequests);
        
        // Combine DB requests with local requests
        setRequests([...dbRequests, ...transformedLocalRequests]);
      } catch (error) {
        console.error("Error loading requests:", error);
      }
    };
    
    loadAllRequests();
  }, [dbRequests]);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      
      // Force re-read of localStorage
      const localRequestsStr = localStorage.getItem('pending_requests') || '[]';
      const localRequests = JSON.parse(localRequestsStr);
      
      toast({
        title: "Data Refreshed",
        description: "Request data has been refreshed."
      });
    } catch (error) {
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
    handleRefresh
  };
}
