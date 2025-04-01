
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceRequestWithItem } from './types';
import { RequestsTable } from '@/components/admin/requests/RequestsTable';
import { useRequestsData } from '@/hooks/useRequestsData';
import { useRequestStatusService } from '@/features/requests/services/requestStatusService';
import { RequestsHeader } from '@/components/admin/requests/RequestsHeader';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

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
  
  // Force a refresh when the component mounts
  useEffect(() => {
    console.log('RequestsTab mounted, forcing refresh of data');
    queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    // Also set up a periodic refresh
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    }, 15000); // Refresh every 15 seconds
    
    return () => clearInterval(interval);
  }, [queryClient]);
  
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
