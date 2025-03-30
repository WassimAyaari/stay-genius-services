
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Clock, Loader, Check, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface RequestStatusActionsProps {
  currentStatus: string;
  onUpdateStatus: (status: 'pending' | 'in_progress' | 'completed' | 'cancelled') => void;
}

export const RequestStatusActions = ({ 
  currentStatus, 
  onUpdateStatus 
}: RequestStatusActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Update Status <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem 
          onClick={() => onUpdateStatus('pending')}
          disabled={currentStatus === 'pending'}
        >
          <Clock className="mr-2 h-4 w-4" />
          Mark as Pending
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onUpdateStatus('in_progress')}
          disabled={currentStatus === 'in_progress'}
        >
          <Loader className="mr-2 h-4 w-4" />
          Mark as In Progress
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onUpdateStatus('completed')}
          disabled={currentStatus === 'completed'}
        >
          <Check className="mr-2 h-4 w-4" />
          Mark as Completed
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onUpdateStatus('cancelled')}
          disabled={currentStatus === 'cancelled'}
        >
          <X className="mr-2 h-4 w-4" />
          Mark as Cancelled
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
