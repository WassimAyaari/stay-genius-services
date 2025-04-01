
import { updateRequestStatus } from '@/features/rooms/controllers/roomService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

type RequestStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export function useRequestStatusService() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const handleUpdateStatus = async (
    requestId: string, 
    newStatus: RequestStatus,
    onSuccess?: () => void
  ) => {
    try {
      await updateRequestStatus(requestId, newStatus);
      
      // Use both toast systems for better visibility
      toast({
        title: "Status Updated",
        description: `Request status changed to ${newStatus}`
      });
      sonnerToast.success("Status Updated", {
        description: `Request status changed to ${newStatus}`
      });
      
      // Forcefully invalidate and refetch to ensure all data is updated
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
      
      // Broadcast the status change event through Supabase
      try {
        const channel = supabase.channel('status-updates');
        channel.subscribe(status => {
          if (status === 'SUBSCRIBED') {
            console.log('Broadcasting status update event');
            channel.send({
              type: 'broadcast',
              event: 'status_updated',
              payload: { 
                requestId, 
                newStatus,
                timestamp: new Date().toISOString()
              }
            });
            
            // Remove the channel after sending the notification
            setTimeout(() => {
              supabase.removeChannel(channel);
            }, 1000);
          }
        });
      } catch (error) {
        console.error('Error broadcasting status update:', error);
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error updating request status:", error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive"
      });
      sonnerToast.error("Error", {
        description: "Failed to update request status"
      });
    }
  };

  return { handleUpdateStatus };
}
