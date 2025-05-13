
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';

interface ConfirmRequestDialogProps {
  open: boolean;
  isSubmitting: boolean;
  item: {
    id: string;
    name: string;
    category: string;
    description?: string;
  } | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmRequestDialog = ({
  open,
  isSubmitting,
  item,
  onCancel,
  onConfirm,
}: ConfirmRequestDialogProps) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent 
        className="sm:max-w-md mx-4 rounded-2xl animate-fade-in" 
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogHeader className="pt-2">
          <DialogTitle id="confirmation-dialog-title" className="text-xl">
            Confirm Service Request
          </DialogTitle>
          <DialogDescription 
            id="confirmation-dialog-description" 
            className="text-gray-500"
          >
            Are you sure you want to request the following service?
          </DialogDescription>
        </DialogHeader>
        <div className="bg-primary/5 rounded-xl p-4 my-4 border border-primary/10">
          <div className="font-medium text-lg">{item.name}</div>
          <div className="text-sm text-gray-500 mt-1">{item.category}</div>
          {item.description && (
            <div className="text-gray-600 mt-3">{item.description}</div>
          )}
        </div>
        <DialogFooter className="sm:justify-between gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto rounded-xl transition-colors"
            aria-label="Cancel request"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl hover:bg-primary/90 transition-colors"
            aria-label="Confirm request"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Confirm Request</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmRequestDialog;
