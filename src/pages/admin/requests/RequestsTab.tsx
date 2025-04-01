
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
  
  // Force multiple refreshes when the component is mounted
  useEffect(() => {
    console.log('RequestsTab mounted, forcing aggressive refresh of data');
    
    // Immediate refresh
    handleRefresh();
    
    // Schedule multiple refresh cycles to ensure data is loaded
    const refreshTimes = [100, 500, 1000, 2000, 5000];
    const refreshTimers = refreshTimes.map(delay => 
      setTimeout(() => {
        console.log(`Performing delayed refresh after ${delay}ms`);
        queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
        queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
      }, delay)
    );
    
    // Set up a dedicated real-time subscription specifically for admin page
    const channel = supabase
      .channel('admin-requests-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'service_requests',
      }, (payload) => {
        console.log('Admin detected service request change:', payload);
        
        // Signal that new requests are available
        setNewRequests(true);
        
        // Show notification based on event type
        if (payload.eventType === 'INSERT') {
          const data = payload.new;
          const requestType = data.type || 'service';
          const roomNumber = data.room_number || 'Unknown';
          
          toast.success('Nouvelle demande reçue', {
            description: `Nouvelle demande de ${requestType} depuis la chambre ${roomNumber}`
          });
          
          // Force immediate data refresh
          queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
          queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
          handleRefresh();
        } else if (payload.eventType === 'UPDATE') {
          toast.info('Demande mise à jour', {
            description: 'Une demande a été modifiée'
          });
          
          // Force refresh
          queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
        }
      })
      .subscribe((status) => {
        console.log('Admin real-time subscription status:', status);
        if (status !== 'SUBSCRIBED') {
          console.error('Failed to subscribe to realtime updates, falling back to polling');
        }
      });
      
    // Listen for broadcast events for status updates
    const statusChannel = supabase
      .channel('status-updates-listener')
      .on('broadcast', { event: 'status_updated' }, (payload) => {
        console.log('Status update broadcast received:', payload);
        
        // Force immediate refresh
        queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
        queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
        
        // Show toast notification
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
    
    // Set up a frequent polling interval as a backup
    const pollingInterval = setInterval(() => {
      console.log('Performing polling refresh of service requests');
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
    }, 3000);
    
    return () => {
      refreshTimers.forEach(clearTimeout);
      clearInterval(pollingInterval);
      supabase.removeChannel(channel);
      supabase.removeChannel(statusChannel);
    };
  }, [queryClient, handleRefresh]);
  
  // Effect to automatically refresh when new requests are detected
  useEffect(() => {
    if (newRequests) {
      console.log('New requests detected, refreshing data');
      handleRefresh();
      setNewRequests(false);
    }
  }, [newRequests, handleRefresh]);
  
  const onUpdateStatus = async (requestId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    await handleUpdateStatus(requestId, newStatus, () => {
      // Force multiple refreshes to ensure data is updated
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
      setTimeout(() => {
        handleRefresh();
      }, 500);
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
