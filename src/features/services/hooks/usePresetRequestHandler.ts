
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserInfo } from './useUserInfo';
import { RequestCategory } from '@/features/rooms/types';
import { submitRequestViaChatMessage } from '../utils/requestSubmissionUtils';

export function usePresetRequestHandler() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePresetRequest = async (
    preset: {category: string, description: string, type: string},
    userInfo: UserInfo,
    selectedCategory: RequestCategory | null,
    onClose: () => void
  ) => {
    try {
      setIsSubmitting(true);
      
      // Submit request via chat message
      const success = await submitRequestViaChatMessage(
        preset.description,
        preset.type,
        userInfo,
        selectedCategory
      );
      
      if (success) {
        toast({
          title: "Request Submitted",
          description: "Your request has been sent successfully."
        });
        
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Failed to submit request. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive"
      });
      console.error("Error submitting request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handlePresetRequest
  };
}
