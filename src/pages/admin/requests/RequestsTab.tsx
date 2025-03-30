
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceRequestWithItem } from './types';
import { RequestsTable } from '@/components/admin/requests/RequestsTable';
import { useRequestsData } from '@/hooks/useRequestsData';
import { useRequestStatusService } from '@/features/requests/services/requestStatusService';
import { RequestsHeader } from '@/components/admin/requests/RequestsHeader';

export const RequestsTab = () => {
  const { 
    requests, 
    isLoading, 
    isRefreshing, 
    handleRefresh 
  } = useRequestsData();
  
  const { handleUpdateStatus } = useRequestStatusService();
  
  const onUpdateStatus = async (requestId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    await handleUpdateStatus(requestId, newStatus, handleRefresh);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <RequestsHeader 
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <RequestsTable 
          requests={requests as ServiceRequestWithItem[]} 
          isLoading={isLoading || isRefreshing} 
          onUpdateStatus={onUpdateStatus}
        />
      </CardContent>
    </Card>
  );
};
