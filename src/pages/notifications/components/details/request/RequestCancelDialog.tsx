
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RequestCancelDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const RequestCancelDialog: React.FC<RequestCancelDialogProps> = ({
  isOpen,
  isLoading,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Annuler votre demande</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir annuler cette demande de service ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Non, garder ma demande
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Annulation...' : 'Oui, annuler'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
