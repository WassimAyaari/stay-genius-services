
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface BookingActionButtonsProps {
  canEdit: boolean;
  canCancel: boolean;
  onEdit: () => void;
  onCancel: () => void;
}

const BookingActionButtons: React.FC<BookingActionButtonsProps> = ({ 
  canEdit, 
  canCancel, 
  onEdit, 
  onCancel 
}) => {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  
  if (!canEdit && !canCancel) return null;
  
  return (
    <>
      <div className="flex justify-end gap-4 pt-4">
        {canEdit && (
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
        )}
        
        {canCancel && (
          <Button
            variant="destructive"
            onClick={() => setIsCancelDialogOpen(true)}
          >
            Cancel
          </Button>
        )}
      </div>
      
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onCancel();
                setIsCancelDialogOpen(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirm Cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BookingActionButtons;
