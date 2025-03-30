
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/features/rooms/types';
import { updateRequestStatus } from '@/features/rooms/controllers/roomService';
import { RequestsTable } from '@/components/admin/requests/RequestsTable';
import { ServiceRequestWithItem } from './types';

export const RequestsTab = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { 
    data: requests, 
    isLoading: isLoadingRequests,
    refetch: refetchRequests
  } = useQuery({
    queryKey: ['service-requests'],
    queryFn: async () => {
      console.log('Fetching service requests...');
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching service requests:', error);
        throw error;
      }
      
      console.log('Service requests fetched:', data);
      
      const serviceRequests = data as ServiceRequest[];
      const requestsWithItems: ServiceRequestWithItem[] = [];
      
      for (const request of serviceRequests) {
        if (request.request_item_id) {
          const { data: itemData, error: itemError } = await supabase
            .from('request_items')
            .select('*')
            .eq('id', request.request_item_id)
            .single();
            
          if (itemError) {
            console.error(`Error fetching item for request ${request.id}:`, itemError);
          }
          
          requestsWithItems.push({
            ...request,
            request_items: itemData || null
          });
        } else {
          requestsWithItems.push({
            ...request,
            request_items: null
          });
        }
      }
      
      console.log('Requests with items:', requestsWithItems);
      return requestsWithItems;
    },
  });
  
  const handleUpdateRequestStatus = async (requestId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      await updateRequestStatus(requestId, newStatus);
      toast({
        title: "Status Updated",
        description: `Request status changed to ${newStatus}`
      });
      refetchRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive"
      });
    }
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchRequests();
      toast({
        title: "Data refreshed",
        description: "The requests have been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Error refreshing data",
        description: "There was a problem refreshing the data.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Request Status Management</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <Card>
        <RequestsTable 
          requests={requests}
          isLoading={isLoadingRequests}
          onUpdateStatus={handleUpdateRequestStatus}
        />
      </Card>
    </>
  );
};
