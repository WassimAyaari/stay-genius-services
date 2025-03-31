
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { TableReservation } from '@/features/dining/types';

interface StatusDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: TableReservation | null;
  newStatus: 'pending' | 'confirmed' | 'cancelled';
  setNewStatus: (status: 'pending' | 'confirmed' | 'cancelled') => void;
  onUpdateStatus: () => void;
}

const StatusDialog = ({
  isOpen,
  onOpenChange,
  reservation,
  newStatus,
  setNewStatus,
  onUpdateStatus
}: StatusDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le statut de la réservation</DialogTitle>
          <DialogDescription>
            Changer le statut de la réservation pour {reservation?.guestName || 'ce client'}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Select 
            value={newStatus} 
            onValueChange={(value: any) => setNewStatus(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmée</SelectItem>
              <SelectItem value="cancelled">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <DialogFooter>
          <Button onClick={onUpdateStatus}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatusDialog;
