
import { updateRequestStatus } from '@/features/rooms/controllers/roomService';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

type RequestStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

const translateStatus = (status: RequestStatus): string => {
  switch (status) {
    case 'pending': return 'en attente';
    case 'in_progress': return 'en cours';
    case 'completed': return 'terminée';
    case 'cancelled': return 'annulée';
    default: return status;
  }
};

export function useRequestStatusService() {
  const { toast } = useToast();
  
  const handleUpdateStatus = async (
    requestId: string, 
    newStatus: RequestStatus,
    onSuccess?: () => void
  ) => {
    try {
      await updateRequestStatus(requestId, newStatus);
      
      // Get translated status for the toast message
      const translatedStatus = translateStatus(newStatus);
      
      toast({
        title: "Statut Mis à Jour",
        description: `Le statut de la demande est maintenant ${translatedStatus}`
      });

      // Afficher également une notification avec Sonner pour plus de visibilité
      sonnerToast.success(`Statut mis à jour`, {
        description: `Le statut de la demande est maintenant ${translatedStatus}`
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error updating request status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la demande",
        variant: "destructive"
      });
    }
  };

  return { handleUpdateStatus };
}
