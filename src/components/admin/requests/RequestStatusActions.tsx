
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Clock, Loader, Check, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

interface RequestStatusActionsProps {
  currentStatus: string;
  requestId: string;
  onUpdateStatus: (status: 'pending' | 'in_progress' | 'completed' | 'cancelled') => void;
}

export const RequestStatusActions = ({ 
  currentStatus, 
  requestId,
  onUpdateStatus 
}: RequestStatusActionsProps) => {
  // Check if it's a local request (stored in localStorage)
  const isLocalRequest = requestId.startsWith('local-');
  
  const handleStatusUpdate = (newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    if (isLocalRequest) {
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
        
        // Call the onUpdateStatus callback to update UI
        onUpdateStatus(newStatus);
        
        toast({
          title: "Status Updated",
          description: `Local request status changed to ${newStatus}`
        });
      } catch (error) {
        console.error("Error updating local request:", error);
        toast({
          title: "Error",
          description: "Failed to update local request status",
          variant: "destructive"
        });
      }
    } else {
      // Handle database requests normally
      onUpdateStatus(newStatus);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Update Status <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem 
          onClick={() => handleStatusUpdate('pending')}
          disabled={currentStatus === 'pending'}
        >
          <Clock className="mr-2 h-4 w-4" />
          Mark as Pending
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStatusUpdate('in_progress')}
          disabled={currentStatus === 'in_progress'}
        >
          <Loader className="mr-2 h-4 w-4" />
          Mark as In Progress
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStatusUpdate('completed')}
          disabled={currentStatus === 'completed'}
        >
          <Check className="mr-2 h-4 w-4" />
          Mark as Completed
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStatusUpdate('cancelled')}
          disabled={currentStatus === 'cancelled'}
        >
          <X className="mr-2 h-4 w-4" />
          Mark as Cancelled
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
