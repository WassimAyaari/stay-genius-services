
import { usePresetRequestHandler } from './usePresetRequestHandler';
import { useMultiItemRequestHandler } from './useMultiItemRequestHandler';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useRequestSubmission() {
  const presetHandler = usePresetRequestHandler();
  const multiItemHandler = useMultiItemRequestHandler();
  const queryClient = useQueryClient();
  
  // Function to invalidate the cache after each submission
  const invalidateRequestsCache = () => {
    console.log('Invalidating serviceRequests cache');
    // Force an immediate refetch of the serviceRequests query
    queryClient.invalidateQueries({ 
      queryKey: ['serviceRequests'],
      refetchType: 'active', // Only refetch active queries
      exact: false // Include any query that starts with serviceRequests
    });
    
    // Wait a short time and invalidate again to ensure data is refreshed
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    }, 500);
  };
  
  // Wrap the handlers to invalidate cache after submission
  const handlePresetRequest = async (...args: Parameters<typeof presetHandler.handlePresetRequest>) => {
    try {
      const result = await presetHandler.handlePresetRequest(...args);
      if (result) {
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
