
import React, { useState } from 'react';
import { NotificationItem } from '@/types/notification';
import { useTableReservations } from '@/hooks/useTableReservations';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { ReservationDetailHeader } from './ReservationDetailHeader';
import { ReservationDetailInfo } from './ReservationDetailInfo';
import { ReservationStatusSection } from './ReservationStatusSection';
import { ReservationActions } from './ReservationActions';
import { ReservationCancelDialog } from './ReservationCancelDialog';

interface ReservationDetailProps {
  notification: NotificationItem;
}

export const ReservationDetail: React.FC<ReservationDetailProps> = ({ notification }) => {
  const { cancelReservation } = useTableReservations();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleCancelReservation = async () => {
    if (!notification.id) return;
    
    setIsUpdating(true);
    try {
      await cancelReservation(notification.id);
      toast.success("Votre réservation a été annulée");
      setIsCancelDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'annulation de la réservation");
      console.error("Error cancelling reservation:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <>
      <Card>
        <ReservationDetailHeader status={notification.status} />
        
        <CardContent className="space-y-4">
          <ReservationDetailInfo notification={notification} />
          <ReservationStatusSection status={notification.status} />
        </CardContent>
        
        <ReservationActions 
          notificationId={notification.id}
          status={notification.status}
          onCancelClick={() => setIsCancelDialogOpen(true)}
        />
      </Card>
      
      <ReservationCancelDialog
        isOpen={isCancelDialogOpen}
        isUpdating={isUpdating}
        onOpenChange={setIsCancelDialogOpen}
        onCancel={handleCancelReservation}
      />
    </>
  );
};
