
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceRequestWithItem } from './types';
import { RequestsTable } from '@/components/admin/requests/RequestsTable';
import { useRequestsData } from '@/hooks/useRequestsData';
import { useRequestStatusService } from '@/features/requests/services/requestStatusService';
import { RequestsHeader } from '@/components/admin/requests/RequestsHeader';
import { ErrorAlert } from '@/components/admin/requests/ErrorAlert';
import { EmptyStateAlert } from '@/components/admin/requests/EmptyStateAlert';
import { useQueryClient } from '@tanstack/react-query';
import { useRequestDemo } from '@/hooks/useRequestDemo';
import { useRequestsRealtime } from '@/hooks/useRequestsRealtime';
import { useInitialDataLoad } from '@/hooks/useInitialDataLoad';

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
  const [dataChecked, setDataChecked] = useState<boolean>(false);
  const { createRealisticRequest } = useRequestDemo();
  
  // Set up initial data loading
  useInitialDataLoad(handleRefresh);
  
  // Set up realtime updates
  useRequestsRealtime(() => setNewRequests(true));
  
  // Mark data as checked after the last refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      setDataChecked(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Effect for actualiser automatiquement lorsque de nouvelles demandes sont détectées
  useEffect(() => {
    if (newRequests) {
      console.log('New requests detected, refreshing data');
      handleRefresh();
      setNewRequests(false);
    }
  }, [newRequests, handleRefresh]);
  
  const onUpdateStatus = async (requestId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    await handleUpdateStatus(requestId, newStatus, () => {
      // Forcer plusieurs actualisations pour s'assurer que les données sont mises à jour
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

        {isError && <ErrorAlert error={error} />}
        
        {dataChecked && requests.length === 0 && !isLoading && !isRefreshing && (
          <EmptyStateAlert onCreateRequest={createRealisticRequest} />
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
