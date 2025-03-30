
import { useState } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useToast } from '@/hooks/use-toast';
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

  // If there's an error, log it
  if (isError && error) {
    console.error("Error fetching service requests:", error);
  }

  return {
    requests,
    isLoading,
    isRefreshing,
    isError,
    error,
    handleRefresh
  };
}
