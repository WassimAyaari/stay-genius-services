
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface SpaBookingActionsProps {
  bookingId: string;
  status: string;
  onCancelBooking: (id: string) => Promise<void>;
}

export const SpaBookingActions: React.FC<SpaBookingActionsProps> = ({ 
  bookingId, 
  status, 
  onCancelBooking 
}) => {
  const navigate = useNavigate();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  
  const canCancel = status === 'pending' || status === 'confirmed';
  
  const handleViewDetails = () => {
    navigate(`/spa/booking/${bookingId}`);
  };
  
  const handleCancelBooking = async () => {
    await onCancelBooking(bookingId);
    setIsCancelDialogOpen(false);
  };
  
  return (
    <>
      <div className="flex justify-end gap-4 pt-4">
        <Button 
          variant="outline" 
          onClick={handleViewDetails}
        >
          Voir les détails complets
        </Button>
        
        {canCancel && (
          <Button
            variant="destructive"
            onClick={() => setIsCancelDialogOpen(true)}
          >
            Annuler la réservation
          </Button>
        )}
      </div>
      
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la réservation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler cette réservation ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelBooking}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmer l'annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
