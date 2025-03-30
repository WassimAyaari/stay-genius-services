
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
    // Check if it's a local request
    if (requestId.startsWith('local-')) {
      try {
        // Update the request in localStorage
        const localRequests = JSON.parse(localStorage.getItem('pending_requests') || '[]');
        const updatedRequests = localRequests.map((req: any) => {
          if (req.id === requestId || (!req.id && requestId.includes(new Date(req.created_at).getTime().toString()))) {
            return { ...req, status: newStatus };
          }
          return req;
        });
        localStorage.setItem('pending_requests', JSON.stringify(updatedRequests));
        
        // Refresh the data to show the updated status
        handleRefresh();
      } catch (error) {
        console.error("Error updating local request:", error);
      }
    } else {
      // Handle database requests normally
      await handleUpdateStatus(requestId, newStatus, handleRefresh);
    }
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
