
import { usePresetRequestHandler } from './usePresetRequestHandler';
import { useMultiItemRequestHandler } from './useMultiItemRequestHandler';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useRequestSubmission() {
  const presetHandler = usePresetRequestHandler();
  const multiItemHandler = useMultiItemRequestHandler();
  const queryClient = useQueryClient();
  
  // Enhanced function to invalidate the cache after each submission
  const invalidateRequestsCache = () => {
    console.log('Aggressively invalidating serviceRequests cache');
    
    // Force an immediate refetch of all serviceRequests queries
    queryClient.invalidateQueries({ 
      queryKey: ['serviceRequests'],
      refetchType: 'all', // Refetch all queries, not just active ones
      exact: false // Include any query that starts with serviceRequests
    });
    
    // Additional invalidation approaches to ensure data freshness
    // Force explicit refetch with higher priority
    queryClient.fetchQuery({
      queryKey: ['serviceRequests'],
      queryFn: () => null,
      staleTime: 0
    });
    
    // Multiple invalidations at different times to handle race conditions
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    }, 100);
    
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
    }, 500);
    
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
    }, 1500);
  };
  
  // Wrap the handlers to invalidate cache after submission
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
