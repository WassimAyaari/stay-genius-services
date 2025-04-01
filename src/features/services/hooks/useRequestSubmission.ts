
import { usePresetRequestHandler } from './usePresetRequestHandler';
import { useMultiItemRequestHandler } from './useMultiItemRequestHandler';
import { useQueryClient } from '@tanstack/react-query';

export function useRequestSubmission() {
  const presetHandler = usePresetRequestHandler();
  const multiItemHandler = useMultiItemRequestHandler();
  const queryClient = useQueryClient();
  
  // Fonction pour invalider le cache après chaque soumission
  const invalidateRequestsCache = () => {
    queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
  };
  
  // Wrap the handlers to invalidate cache after submission
  const handlePresetRequest = async (...args: Parameters<typeof presetHandler.handlePresetRequest>) => {
    const result = await presetHandler.handlePresetRequest(...args);
    if (result) {
      invalidateRequestsCache();
    }
    return result;
  };
  
  const handleSubmitRequests = async (...args: Parameters<typeof multiItemHandler.handleSubmitRequests>) => {
    const result = await multiItemHandler.handleSubmitRequests(...args);
    if (result) {
      invalidateRequestsCache();
    }
    return result;
  };
  
  return {
    isSubmitting: presetHandler.isSubmitting || multiItemHandler.isSubmitting,
    handlePresetRequest,
    handleSubmitRequests
  };
}
