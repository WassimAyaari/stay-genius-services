
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Receipt } from "lucide-react";

interface BillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firstName: string;
  lastName: string;
  stayDuration: number | null;
}

const BillDialog = ({ open, onOpenChange, firstName, lastName, stayDuration }: BillDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Facture
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-2">Informations client</h3>
            <p className="text-sm text-muted-foreground">
              {firstName} {lastName}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Détails du séjour</h3>
            <p className="text-sm text-muted-foreground">
              Durée : {stayDuration} {stayDuration === 1 ? 'nuit' : 'nuits'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillDialog;
