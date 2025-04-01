
import { useState } from 'react';
import { RequestCategory, RequestItem } from '@/features/rooms/types';
import { Room } from '@/hooks/useRoom';
import { useRequestItems } from '@/hooks/useRequestCategories';
import { useUserInfo } from './useUserInfo';
import { useRequestSubmission } from './useRequestSubmission';
import { toast } from 'sonner';

export function useRequestDialog(room: Room | null, onClose: () => void) {
  const [view, setView] = useState<'categories' | 'items' | 'presets'>('presets');
  const [selectedCategory, setSelectedCategory] = useState<RequestCategory | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Get user info management
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
    handlePresetRequest: submitPresetRequest,
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

  const handleGoBackToPresets = () => {
    setSelectedCategory(null);
    setSelectedItems([]);
    setView('presets');
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

  // Update the handle preset request to show status information
  const handlePresetRequest = async (preset: {category: string, description: string, type: string}) => {
    if (!userInfo.name || !userInfo.roomNumber) {
      setIsUserInfoDialogOpen(true);
      return;
    }
    
    try {
      const response = await submitPresetRequest(preset, userInfo, selectedCategory, onClose);
      
      // Show a success toast with tracking information
      toast.success("Request Submitted", {
        description: `Your ${preset.type} request has been sent. You can track its status in the notifications panel.`,
      });
      
      // Store the request ID for tracking
      const requestIds = JSON.parse(localStorage.getItem('pending_requests') || '[]');
      if (response && typeof response === 'object' && 'id' in response) {
        requestIds.push(response.id);
        localStorage.setItem('pending_requests', JSON.stringify(requestIds));
      }
    } catch (error) {
      console.error("Error submitting preset request:", error);
      toast.error("Error", {
        description: "Failed to submit your request. Please try again.",
      });
    }
  };

  // Update the handle submit requests to show status information
  const handleSubmitRequests = async () => {
    if (!userInfo.name || !userInfo.roomNumber) {
      setIsUserInfoDialogOpen(true);
      return;
    }
    
    try {
      const response = await submitRequests(selectedItems, categoryItems, userInfo, selectedCategory, onClose);
      
      // Show a success toast with tracking information
      toast.success("Request Submitted", {
        description: `Your request has been sent. You can track its status in the notifications panel.`,
      });
      
      // Store the request ID for tracking
      const requestIds = JSON.parse(localStorage.getItem('pending_requests') || '[]');
      if (response && Array.isArray(response) && response.length > 0) {
        response.forEach((item: any) => {
          if (item && typeof item === 'object' && 'id' in item) {
            requestIds.push(item.id);
          }
        });
        localStorage.setItem('pending_requests', JSON.stringify(requestIds));
      }
    } catch (error) {
      console.error("Error submitting requests:", error);
      toast.error("Error", {
        description: "Failed to submit your request. Please try again.",
      });
    }
  };

  const getDialogTitle = () => {
    if (view === 'presets') return "Common Requests";
    if (view === 'categories') return "Select Request Category";
    if (selectedCategory) return `Select ${selectedCategory.name} Requests`;
    return "Select Request";
  };

  const getDialogDescription = () => {
    if (view === 'presets') return "Choose from common requests or browse all categories";
    if (view === 'categories') return "Choose a category to see available requests";
    if (selectedCategory) return "Select the items you'd like to request";
    return "";
  };

  // Reset state when dialog closes
  const handleDialogClose = () => {
    setView('presets');
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
    handleGoBackToPresets,
    handleToggleRequestItem,
    handlePresetRequest,
    handleSubmitRequests,
    saveUserInfo,
    handleDialogClose
  };
}
