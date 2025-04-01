
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { Loader } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RequestStatusBadge } from './RequestStatusBadge';
import { RequestStatusActions } from './RequestStatusActions';
import { ServiceRequestWithItem } from '../../../pages/admin/requests/types';

interface RequestsTableProps {
  requests: ServiceRequestWithItem[] | undefined;
  isLoading: boolean;
  onUpdateStatus: (requestId: string, status: 'pending' | 'in_progress' | 'completed' | 'cancelled') => Promise<void>;
}

export const RequestsTable = ({ 
  requests, 
  isLoading, 
  onUpdateStatus 
}: RequestsTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasData = requests && requests.length > 0;
  
  return (
    <ScrollArea className="h-[500px]">
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
          {hasData ? (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.room_number || request.room_id || 'N/A'}</TableCell>
                <TableCell>{request.guest_name || 'Unknown'}</TableCell>
                <TableCell className="capitalize">{request.type.replace('_', ' ')}</TableCell>
                <TableCell>
                  {request.request_items ? (
                    <span>{request.request_items.name}</span>
                  ) : (
                    <span>{request.description || '-'}</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(request.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <RequestStatusBadge status={request.status} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <RequestStatusActions 
                      currentStatus={request.status}
                      requestId={request.id}
                      onUpdateStatus={(newStatus) => onUpdateStatus(request.id, newStatus)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No requests found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
