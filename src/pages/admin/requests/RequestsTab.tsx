
import React, { useState } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { 
  Card, 
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { updateRequestStatus } from '@/features/rooms/controllers/roomService';
import { useToast } from '@/hooks/use-toast';
import { ServiceRequestWithItem } from '../requests/types';
import { RequestsTable } from '@/components/admin/requests/RequestsTable';

export const RequestsTab = () => {
  const { toast } = useToast();
  const { data: requests = [], isLoading, isError, refetch } = useServiceRequests();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Utilisons directement les données sans état supplémentaire pour éviter la boucle infinie
  console.log("RequestsTab rendering with data:", requests);

  const handleUpdateStatus = async (requestId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      await updateRequestStatus(requestId, newStatus);
      toast({
        title: "Status Updated",
        description: `Request status changed to ${newStatus}`
      });
      refetch();
    } catch (error) {
      console.error("Error updating request status:", error);
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

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Request Status Management</h2>
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

        <RequestsTable 
          requests={requests as ServiceRequestWithItem[]} 
          isLoading={isLoading || isRefreshing} 
          onUpdateStatus={handleUpdateStatus}
        />
      </CardContent>
    </Card>
  );
};
