
import { usePresetRequestHandler } from './usePresetRequestHandler';
import { useMultiItemRequestHandler } from './useMultiItemRequestHandler';
import { submitRequestViaChatMessage } from '../utils/requestSubmissionUtils';

export function useRequestSubmission() {
  const presetHandler = usePresetRequestHandler();
  const multiItemHandler = useMultiItemRequestHandler();
  
  return {
    isSubmitting: presetHandler.isSubmitting || multiItemHandler.isSubmitting,
    submitRequestViaChatMessage,
    handlePresetRequest: presetHandler.handlePresetRequest,
    handleSubmitRequests: multiItemHandler.handleSubmitRequests
  };
}
