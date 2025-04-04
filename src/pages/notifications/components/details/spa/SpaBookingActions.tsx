
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
import { Edit, XCircle } from 'lucide-react';

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
  const [isUpdating, setIsUpdating] = useState(false);
  
  const canCancel = status === 'pending' || status === 'confirmed';
  const canEdit = status === 'pending';
  
  const handleViewDetails = () => {
    navigate(`/spa/booking/${bookingId}`);
  };
  
  const handleCancelBooking = async () => {
    setIsUpdating(true);
    try {
      await onCancelBooking(bookingId);
      setIsCancelDialogOpen(false);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <>
      <div className="flex flex-wrap gap-3 justify-start">
        <Button 
          variant="outline" 
          onClick={() => navigate('/spa')}
        >
          Voir les services spa
        </Button>
        
        {canEdit && (
          <Button 
            variant="outline"
            onClick={() => navigate(`/spa/booking/${bookingId}?edit=true`)}
            className="bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        )}
        
        {canCancel && (
          <Button
            variant="destructive"
            onClick={() => setIsCancelDialogOpen(true)}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Annuler
          </Button>
        )}
      </div>
      
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler votre réservation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler cette réservation de spa ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Non, garder ma réservation</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelBooking}
              className="bg-red-600 hover:bg-red-700"
              disabled={isUpdating}
            >
              {isUpdating ? 'Annulation...' : 'Oui, annuler'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
