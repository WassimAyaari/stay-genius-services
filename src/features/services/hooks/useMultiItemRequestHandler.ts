
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserInfo } from './useUserInfo';
import { RequestCategory } from '@/features/rooms/types';
import { submitRequestViaChatMessage } from '../utils/requestUtils';

export function useMultiItemRequestHandler() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitRequests = async (
    selectedItems: string[],
    categoryItems: any[] | undefined,
    userInfo: UserInfo,
    selectedCategory: RequestCategory | null,
    onClose: () => void
  ) => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one request item",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      let successCount = 0;
      
      // Submit each selected item
      for (const itemId of selectedItems) {
        // Find the item name for better description
        const itemName = categoryItems?.find(item => item.id === itemId)?.name || 'Unknown Item';
        const categoryName = selectedCategory?.name || 'Custom Request';
        const description = `${categoryName} - ${itemName}`;
        
        // Submit via chat message
        const success = await submitRequestViaChatMessage(
          description,
          selectedCategory?.name.toLowerCase() || 'custom',
          userInfo,
          selectedCategory
        );
        
        if (success) {
          successCount++;
        }
      }
      
      if (successCount > 0) {
        toast({
          title: "Requests Submitted",
          description: `${successCount} request(s) have been sent successfully.`
        });
        
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Failed to submit requests. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit requests. Please try again.",
        variant: "destructive"
      });
      console.error("Error submitting requests:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmitRequests
  };
}
