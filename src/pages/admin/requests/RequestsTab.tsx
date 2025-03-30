
import React, { useState, useEffect } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { 
  Card, 
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { RequestStatusBadge } from '@/components/admin/requests/RequestStatusBadge';
import { RequestStatusActions } from '@/components/admin/requests/RequestStatusActions';
import { updateRequestStatus } from '@/features/rooms/controllers/roomService';
import { useToast } from '@/hooks/use-toast';
import { ServiceRequestWithItem } from '../requests/types';

export const RequestsTab = () => {
  const { toast } = useToast();
  const { data: requests = [], isLoading, isError, refetch } = useServiceRequests();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [requestsWithDetails, setRequestsWithDetails] = useState<ServiceRequestWithItem[]>([]);

  // Fix: Only update state when requests change, not on every render
  useEffect(() => {
    if (requests && requests.length > 0) {
      console.info("Requests with items:", requests);
      setRequestsWithDetails(requests as ServiceRequestWithItem[]);
    }
  }, [requests]);

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

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500">
            Error loading requests. Please try again.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requestsWithDetails.length > 0 ? (
                  requestsWithDetails.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.room_number || 'N/A'}</TableCell>
                      <TableCell>{request.guest_name || 'Anonymous'}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell className="max-w-xs truncate">{request.description || 'No description'}</TableCell>
                      <TableCell>
                        {request.created_at 
                          ? formatDistanceToNow(new Date(request.created_at), { addSuffix: true }) 
                          : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <RequestStatusBadge status={request.status} />
                      </TableCell>
                      <TableCell>
                        <RequestStatusActions 
                          currentStatus={request.status} 
                          onUpdateStatus={(newStatus) => handleUpdateStatus(request.id, newStatus)} 
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
