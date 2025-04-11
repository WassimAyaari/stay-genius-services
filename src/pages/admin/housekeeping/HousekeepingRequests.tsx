import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useRequestsData } from '@/hooks/useRequestsData';
import { RequestsTable } from '@/components/admin/requests/RequestsTable';
import { useRequestStatusService } from '@/features/requests/services/requestStatusService';
import { RequestsHeader } from '@/components/admin/requests/RequestsHeader';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HousekeepingRequests = () => {
  const { 
    requests, 
    isLoading, 
    isRefreshing, 
    isError,
    error,
    handleRefresh 
  } = useRequestsData('housekeeping');
  
  const { handleUpdateStatus } = useRequestStatusService();
  
  const onUpdateStatus = async (requestId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    await handleUpdateStatus(requestId, newStatus, handleRefresh);
  };

  // Force refresh on first render
  React.useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-2xl font-semibold mb-6">Housekeeping Requests</h1>
        
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

            {!requests || requests.length === 0 ? (
              <Alert className="mb-4">
                <AlertTitle>No requests found</AlertTitle>
                <AlertDescription>
                  There are currently no housekeeping requests in the system.
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRefresh}
                      className="mt-2"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <RequestsTable 
                requests={requests} 
                isLoading={isLoading || isRefreshing} 
                onUpdateStatus={onUpdateStatus}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default HousekeepingRequests;
