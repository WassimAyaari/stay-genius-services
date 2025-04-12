
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Room } from '@/hooks/useRoom';

interface RequestDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  room: Room | null;
}

// This component will be disabled
const RequestDialog = ({ isOpen, onOpenChange, room }: RequestDialogProps) => {
  // Return null to disable the component completely
  return null;
};

export default RequestDialog;
