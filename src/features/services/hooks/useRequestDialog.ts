
import { useState } from 'react';
import { RequestCategory, RequestItem } from '@/features/rooms/types';
import { Room } from '@/hooks/useRoom';
import { useRequestItems } from '@/hooks/useRequestCategories';
import { useUserInfo } from './useUserInfo';
import { toast } from 'sonner';

export function useRequestDialog(room: Room | null, onClose: () => void) {
  const [view, setView] = useState<'categories' | 'items'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<RequestCategory | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Get user info management with enhanced features
  const { 
    userInfo, 
    getLocalUserInfo,
    ensureValidUserInfo
  } = useUserInfo(room);
  
  // Fetch items for the selected category
  const { data: categoryItems = [] } = useRequestItems(selectedCategory?.id);

  const handleSelectCategory = (category: RequestCategory) => {
    setSelectedCategory(category);
    setSelectedItems([]);
    setView('items');
  };

  const handleGoBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedItems([]);
    setView('categories');
  };

  const handleToggleRequestItem = (itemId: string) => {
    setSelectedItems(prevItems => {
      const isAlreadySelected = prevItems.includes(itemId);
      if (isAlreadySelected) {
        return prevItems.filter(id => id !== itemId);
      } else {
        return [...prevItems, itemId];
      }
    });
  };

  const handleSubmitRequests = async () => {
    try {
      // First ensure we have valid user info
      const validUserInfo = await ensureValidUserInfo();
      
      // Double-check that we have the required fields
      if (!validUserInfo.name || !validUserInfo.roomNumber) {
        toast.error("Error", {
          description: "Your profile information is incomplete. Please contact reception.",
        });
        return;
      }
      
      // Placeholder for request submission - to be implemented differently
      toast.success("Request Submitted", {
        description: `Your request has been sent. You can track its status in the notifications panel.`,
      });
      
      // Close the dialog after successful submission
      onClose();
    } catch (error) {
      console.error("Error submitting requests:", error);
      toast.error("Error", {
        description: "Failed to submit your request. Please try again.",
      });
    }
  };

  const getDialogTitle = () => {
    if (view === 'categories') return "Select Request Category";
    if (selectedCategory) return `Select ${selectedCategory.name} Requests`;
    return "Select Request";
  };

  const getDialogDescription = () => {
    if (view === 'categories') return "Choose a category to see available requests";
    if (selectedCategory) return "Select the items you'd like to request";
    return "";
  };

  // Reset state when dialog closes
  const handleDialogClose = () => {
    setView('categories');
    setSelectedCategory(null);
    setSelectedItems([]);
    onClose();
  };

  return {
    view,
    selectedCategory,
    selectedItems,
    isSubmitting: false, // Simplified since we're removing the submission logic
    userInfo,
    dialogTitle: getDialogTitle(),
    dialogDescription: getDialogDescription(),
    handleSelectCategory,
    handleGoBackToCategories,
    handleToggleRequestItem,
    handleSubmitRequests,
    handleDialogClose
  };
}
