
import { usePresetRequestHandler } from './usePresetRequestHandler';
import { useMultiItemRequestHandler } from './useMultiItemRequestHandler';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useRequestSubmission() {
  const presetHandler = usePresetRequestHandler();
  const multiItemHandler = useMultiItemRequestHandler();
  const queryClient = useQueryClient();
  
  // Improved function to aggressively invalidate cache after each submission
  const invalidateRequestsCache = () => {
    console.log('Aggressively invalidating serviceRequests cache with multiple approaches');
    
    // Approach 1: Direct invalidation
    queryClient.invalidateQueries({ 
      queryKey: ['serviceRequests'],
      refetchType: 'all',
      exact: false
    });
    
    // Approach 2: Immediate force refresh
    queryClient.refetchQueries({ 
      queryKey: ['serviceRequests'],
      type: 'all'
    });
    
    // Approach 3: Multiple invalidations at different times to handle race conditions
    const delays = [100, 500, 1000, 2000, 5000];
    delays.forEach(delay => {
      setTimeout(() => {
        console.log(`Delayed cache invalidation after ${delay}ms`);
        queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
        queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
      }, delay);
    });
    
    // Approach 4: Send notification through realtime to trigger listeners
    try {
      // This is a broadcast technique to ensure all subscribers know about the new request
      const channel = supabase.channel('request_submission_notification');
      channel.subscribe(status => {
        if (status === 'SUBSCRIBED') {
          console.log('Broadcasting request_submitted event to all listeners');
          channel.send({
            type: 'broadcast',
            event: 'request_submitted',
            payload: { 
              timestamp: new Date().toISOString(),
              message: 'New service request submitted'
            }
          });
          
          // Remove the channel after sending the notification
          setTimeout(() => {
            supabase.removeChannel(channel);
          }, 1000);
        }
      });
    } catch (error) {
      console.error('Error broadcasting request submission:', error);
    }
  };
  
  // Wrap handlers to invalidate cache after submission
  const handlePresetRequest = async (...args: Parameters<typeof presetHandler.handlePresetRequest>) => {
    try {
      const result = await presetHandler.handlePresetRequest(...args);
      if (result) {
        console.log('Preset request submitted successfully, invalidating cache');
        invalidateRequestsCache();
        toast.success('Demande soumise avec succès', {
          description: 'Votre demande a été envoyée et sera traitée prochainement'
        });
      }
      return result;
    } catch (error) {
      console.error('Error in handlePresetRequest:', error);
      toast.error('Erreur lors de la soumission de la demande', {
        description: 'Veuillez réessayer plus tard'  
      });
      return false;
    }
  };
  
  const handleSubmitRequests = async (...args: Parameters<typeof multiItemHandler.handleSubmitRequests>) => {
    try {
      const result = await multiItemHandler.handleSubmitRequests(...args);
      if (result) {
        console.log('Multiple requests submitted successfully, invalidating cache');
        invalidateRequestsCache();
        toast.success('Demandes soumises avec succès', {
          description: 'Vos demandes ont été envoyées et seront traitées prochainement'
        });
      }
      return result;
    } catch (error) {
      console.error('Error in handleSubmitRequests:', error);
      toast.error('Erreur lors de la soumission des demandes', {
        description: 'Veuillez réessayer plus tard'
      });
      return false;
    }
  };
  
  return {
    isSubmitting: presetHandler.isSubmitting || multiItemHandler.isSubmitting,
    handlePresetRequest,
    handleSubmitRequests
  };
}
