
import { usePresetRequestHandler } from './usePresetRequestHandler';
import { useMultiItemRequestHandler } from './useMultiItemRequestHandler';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useRequestSubmission() {
  const presetHandler = usePresetRequestHandler();
  const multiItemHandler = useMultiItemRequestHandler();
  const queryClient = useQueryClient();
  
  // Improved function to invalidate cache after each submission
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
    const delays = [100, 500, 1000, 2000];
    delays.forEach(delay => {
      setTimeout(() => {
        console.log(`Delayed cache invalidation after ${delay}ms`);
        queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
        queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
      }, delay);
    });
    
    // Approach 4: Send notification through realtime to trigger listeners
    try {
      // This is a notification technique to ensure all subscribers know about the new request
      // It doesn't actually insert new data, just triggers the realtime listeners
      const channel = supabase.channel('request_submission_notification');
      channel.subscribe(status => {
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'request_submitted',
            payload: { timestamp: new Date().toISOString() }
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
        toast.success('Demande soumise avec succès');
      }
      return result;
    } catch (error) {
      console.error('Error in handlePresetRequest:', error);
      toast.error('Erreur lors de la soumission de la demande');
      return false;
    }
  };
  
  const handleSubmitRequests = async (...args: Parameters<typeof multiItemHandler.handleSubmitRequests>) => {
    try {
      const result = await multiItemHandler.handleSubmitRequests(...args);
      if (result) {
        console.log('Multiple requests submitted successfully, invalidating cache');
        invalidateRequestsCache();
        toast.success('Demandes soumises avec succès');
      }
      return result;
    } catch (error) {
      console.error('Error in handleSubmitRequests:', error);
      toast.error('Erreur lors de la soumission des demandes');
      return false;
    }
  };
  
  return {
    isSubmitting: presetHandler.isSubmitting || multiItemHandler.isSubmitting,
    handlePresetRequest,
    handleSubmitRequests
  };
}
