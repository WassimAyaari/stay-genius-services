
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CancelRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  serviceName: string;
}

export const CancelRequestDialog = ({ 
  isOpen, 
  onOpenChange, 
  onConfirm, 
  isLoading,
  serviceName
}: CancelRequestDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Annuler votre demande</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir annuler cette demande de {serviceName.toLowerCase()} ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
