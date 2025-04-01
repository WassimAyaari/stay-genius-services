
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
    setUserInfo,
    isUserInfoDialogOpen, 
    setIsUserInfoDialogOpen, 
    saveUserInfo 
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

  // Update the handle submit requests to show status information
  const handleSubmitRequests = async () => {
    // Check if user info is available from localStorage or context
    if (!userInfo.name || !userInfo.roomNumber) {
      toast.error("Error", {
        description: "Your profile information is incomplete. Please contact reception.",
      });
      return;
    }
    
    try {
      // Call the submission function, but don't rely on its return value
      await submitRequests(selectedItems, categoryItems, userInfo, selectedCategory, onClose);
      
      // Show a success toast with tracking information
      toast.success("Request Submitted", {
        description: `Your request has been sent. You can track its status in the notifications panel.`,
      });
      
      // Generate mock IDs for tracking since we're not using the actual response
      const requestIds = JSON.parse(localStorage.getItem('pending_requests') || '[]');
      
      // Add a mock ID for each selected item
      selectedItems.forEach(itemId => {
        const mockRequestId = `mock-${itemId}-${Date.now()}`;
        requestIds.push(mockRequestId);
      });
      
      localStorage.setItem('pending_requests', JSON.stringify(requestIds));
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
    isUserInfoDialogOpen,
    userInfo,
    dialogTitle: getDialogTitle(),
    dialogDescription: getDialogDescription(),
    setIsUserInfoDialogOpen,
    setUserInfo,
    handleSelectCategory,
    handleGoBackToCategories,
    handleToggleRequestItem,
    handleSubmitRequests,
    saveUserInfo,
    handleDialogClose
  };
}
