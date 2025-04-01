
import { useState } from 'react';
import { RequestCategory, RequestItem } from '@/features/rooms/types';
import { Room } from '@/hooks/useRoom';
import { useRequestItems } from '@/hooks/useRequestCategories';
import { useUserInfo } from './useUserInfo';
import { useRequestSubmission } from './useRequestSubmission';
import { toast } from 'sonner';

export function useRequestDialog(room: Room | null, onClose: () => void) {
  const [view, setView] = useState<'categories' | 'items'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<RequestCategory | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Get user info management - don't show dialog automatically
  const { 
    userInfo, 
    getUserInfo
  } = useUserInfo(room);
  
  // Get request submission functionality
  const {
    isSubmitting,
    handleSubmitRequests: submitRequests
  } = useRequestSubmission();
  
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

  // Update the handle submit requests to use the most up-to-date user info
  const handleSubmitRequests = async () => {
    // Get the most recent user info from localStorage
    const currentUserInfo = getUserInfo();
    
    // Verify user info is valid and complete
    if (!currentUserInfo.name || !currentUserInfo.roomNumber) {
      toast.error("Error", {
        description: "Your profile information is incomplete. Please contact reception.",
      });
      return;
    }
    
    try {
      // Call the submission function with the current user info
      await submitRequests(selectedItems, categoryItems, currentUserInfo, selectedCategory, onClose);
      
      // Show a success toast with tracking information
      toast.success("Request Submitted", {
        description: `Your request has been sent. You can track its status in the notifications panel.`,
      });
      
      // Generate mock IDs for tracking
      const requestIds = JSON.parse(localStorage.getItem('pending_requests') || '[]');
      
      // Add a mock ID for each selected item
      selectedItems.forEach(itemId => {
        const mockRequestId = `mock-${itemId}-${Date.now()}`;
        requestIds.push(mockRequestId);
      });
      
      localStorage.setItem('pending_requests', JSON.stringify(requestIds));
      
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
    isSubmitting,
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
