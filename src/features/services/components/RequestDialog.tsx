
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Room } from '@/hooks/useRoom';

interface RequestDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  room: Room | null;
}

// This component is now disabled - it will render nothing
const RequestDialog = ({ isOpen, onOpenChange }: RequestDialogProps) => {
  // Return null to prevent rendering
  return null;
};

export default RequestDialog;
