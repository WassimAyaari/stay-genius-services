
import { usePresetRequestHandler } from './usePresetRequestHandler';
import { useMultiItemRequestHandler } from './useMultiItemRequestHandler';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useRequestSubmission() {
  const presetHandler = usePresetRequestHandler();
  const multiItemHandler = useMultiItemRequestHandler();
  const queryClient = useQueryClient();
  
  // Fonction améliorée pour invalider le cache après chaque soumission
  const invalidateRequestsCache = () => {
    console.log('Aggressively invalidating serviceRequests cache with multiple approaches');
    
    // Approche 1: Invalidation directe
    queryClient.invalidateQueries({ 
      queryKey: ['serviceRequests'],
      refetchType: 'all',
      exact: false
    });
    
    // Approche 2: Force refresh immédiat
    queryClient.refetchQueries({ 
      queryKey: ['serviceRequests'],
      type: 'all'
    });
    
    // Approche 3: Invalidations multiples à différents moments pour gérer conditions de concurrence
    const delays = [100, 500, 1000, 2000];
    delays.forEach(delay => {
      setTimeout(() => {
        console.log(`Delayed cache invalidation after ${delay}ms`);
        queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
        queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
      }, delay);
    });
  };
  
  // Envelopper les gestionnaires pour invalider le cache après soumission
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
