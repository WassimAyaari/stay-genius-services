
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
      console.log(`Updating request ${requestId} status to ${newStatus}...`);
      
      // Mettre à jour directement via Supabase pour plus de fiabilité
      const { data, error } = await supabase
        .from('service_requests')
        .update({ status: newStatus })
        .eq('id', requestId)
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log(`Successfully updated request status:`, data);
      
      // Appeler également la fonction de service existante pour maintenir la compatibilité
      try {
        await updateRequestStatus(requestId, newStatus);
      } catch (serviceError) {
        console.warn('Secondary update method failed but primary succeeded:', serviceError);
      }
      
      // Utiliser les deux systèmes de toast pour une meilleure visibilité
      toast({
        title: "Statut mis à jour",
        description: `Le statut de la requête est maintenant: ${newStatus}`
      });
      sonnerToast.success("Statut mis à jour", {
        description: `Le statut de la requête est maintenant: ${newStatus}`
      });
      
      // Invalider et réactualiser de force pour s'assurer que toutes les données sont mises à jour
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
      
      // Diffuser l'événement de changement de statut via Supabase
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
            
            // Supprimer le canal après avoir envoyé la notification
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
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la requête",
        variant: "destructive"
      });
      sonnerToast.error("Erreur", {
        description: "Impossible de mettre à jour le statut de la requête"
      });
    }
  };

  return { handleUpdateStatus };
}
