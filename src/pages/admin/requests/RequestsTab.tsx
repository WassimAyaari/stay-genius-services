
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceRequestWithItem } from './types';
import { RequestsTable } from '@/components/admin/requests/RequestsTable';
import { useRequestsData } from '@/hooks/useRequestsData';
import { useRequestStatusService } from '@/features/requests/services/requestStatusService';
import { RequestsHeader } from '@/components/admin/requests/RequestsHeader';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const RequestsTab = () => {
  const { 
    requests, 
    isLoading, 
    isRefreshing, 
    isError,
    error,
    handleRefresh 
  } = useRequestsData();
  
  const { handleUpdateStatus } = useRequestStatusService();
  const queryClient = useQueryClient();
  const [newRequests, setNewRequests] = useState<boolean>(false);
  
  // Force a refresh when the component mounts and set up stronger real-time monitoring
  useEffect(() => {
    console.log('RequestsTab mounted, forcing refresh of data');
    
    // Immediate refresh when component mounts
    queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    handleRefresh();
    
    // Set up more frequent periodic refresh
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    }, 5000); // Refresh every 5 seconds
    
    // Set up real-time subscription with improved handling
    const channel = supabase
      .channel('admin-service-requests-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'service_requests',
      }, (payload) => {
        console.log('Admin detected service request change:', payload);
        
        // Flag that new requests are available
        setNewRequests(true);
        
        // Show notification for changes
        if (payload.eventType === 'INSERT') {
          toast.success('New service request received', {
            description: 'Pull down to refresh or click the refresh button'
          });
        } else if (payload.eventType === 'UPDATE') {
          toast.info('Service request updated', {
            description: 'A request status has been changed'
          });
        }
        
        // Force a refresh of the data
        queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      })
      .subscribe((status) => {
        console.log('Admin real-time subscription status:', status);
      });
    
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [queryClient, handleRefresh]);
  
  // Effect to auto-refresh when new requests are detected
  useEffect(() => {
    if (newRequests) {
      handleRefresh();
      setNewRequests(false);
    }
  }, [newRequests, handleRefresh]);
  
  const onUpdateStatus = async (requestId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    await handleUpdateStatus(requestId, newStatus, () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      handleRefresh();
    });
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
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load request data. Please try refreshing.
              {error && <div className="mt-2 text-xs opacity-80">{String(error)}</div>}
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
