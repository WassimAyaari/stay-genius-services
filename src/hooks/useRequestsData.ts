
import { useState, useEffect } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useToast } from '@/hooks/use-toast';
import { ServiceRequest } from '@/features/rooms/types';

export function useRequestsData() {
  const { toast } = useToast();
  const { data: requests = [], isLoading, isError, refetch } = useServiceRequests();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      
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
