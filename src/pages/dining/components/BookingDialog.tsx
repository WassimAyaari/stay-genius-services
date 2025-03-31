
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReservationForm from '@/components/ReservationForm';

interface BookingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId: string;
  restaurantName: string;
  onSuccess: () => void;
  buttonText?: string;
}

const BookingDialog = ({ 
  isOpen, 
  onOpenChange, 
  restaurantId, 
  restaurantName,
  onSuccess,
  buttonText
}: BookingDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Réserver une table - {restaurantName}</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire ci-dessous pour réserver une table.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="p-6 pt-2">
            {restaurantId && restaurantId !== ':id' && (
              <ReservationForm 
                restaurantId={restaurantId} 
                onSuccess={onSuccess}
                buttonText={buttonText}
              />
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
