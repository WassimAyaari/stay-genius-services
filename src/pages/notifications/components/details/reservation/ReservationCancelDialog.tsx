
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

interface ReservationCancelDialogProps {
  isOpen: boolean;
  isUpdating: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}

export const ReservationCancelDialog: React.FC<ReservationCancelDialogProps> = ({
  isOpen,
  isUpdating,
  onOpenChange,
  onCancel
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Annuler votre réservation</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir annuler cette réservation au restaurant ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Non, garder ma réservation
          </Button>
          <Button variant="destructive" onClick={onCancel} disabled={isUpdating}>
            {isUpdating ? 'Annulation...' : 'Oui, annuler'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
