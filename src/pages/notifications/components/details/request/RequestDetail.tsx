
import React, { useState, useEffect } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { NotificationItem } from '@/types/notification';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { RequestDetailHeader } from './RequestDetailHeader';
import { RequestDetailContent } from './RequestDetailContent';
import { RequestDetailStatus } from './RequestDetailStatus';
import { RequestActions } from './RequestActions';
import { RequestCancelDialog } from './RequestCancelDialog';

interface RequestDetailProps {
  notification: NotificationItem;
}

export const RequestDetail: React.FC<RequestDetailProps> = ({ notification }) => {
  const { cancelRequest, isCancelling } = useServiceRequests();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  
  // Prevent multiple re-renders by logging only once
  useEffect(() => {
    console.log('RequestDetail rendered with notification ID:', notification.id);
  }, [notification.id]);
  
  const handleCancelRequest = async () => {
    try {
      await cancelRequest(notification.id);
      toast.success("Votre demande a été annulée");
      setIsCancelDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'annulation de la demande");
      console.error("Error cancelling request:", error);
    }
  };
  
  const creationDate = notification.time || new Date();
  
  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <RequestDetailHeader 
            serviceType={notification.data?.service_type}
            status={notification.status}
          />
        </CardHeader>
        
        <CardContent className="space-y-4">
          <RequestDetailContent
            description={notification.description}
            roomNumber={notification.data?.room_number}
            creationDate={creationDate}
          />
          
          <RequestDetailStatus status={notification.status} />
        </CardContent>
        
        <CardFooter>
          <RequestActions 
            status={notification.status}
            onCancelRequest={() => setIsCancelDialogOpen(true)}
          />
        </CardFooter>
      </Card>
      
      <RequestCancelDialog
        isOpen={isCancelDialogOpen}
        isLoading={isCancelling}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancelRequest}
      />
    </>
  );
};
