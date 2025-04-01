
import { updateRequestStatus } from '@/features/rooms/controllers/roomService';
import { useToast } from '@/hooks/use-toast';

type RequestStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export function useRequestStatusService() {
  const { toast } = useToast();
  
  const handleUpdateStatus = async (
    requestId: string, 
    newStatus: RequestStatus,
    onSuccess?: () => void
  ) => {
    try {
      await updateRequestStatus(requestId, newStatus);
      toast({
        title: "Status Updated",
        description: `Request status changed to ${newStatus}`
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error updating request status:", error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive"
      });
    }
  };

  return { handleUpdateStatus };
}
