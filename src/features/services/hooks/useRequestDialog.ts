
import { useState, useCallback } from 'react';
import { Room } from '@/hooks/useRoom';
import { useRequestSubmission } from './useRequestSubmission';
import { useUserInfo } from './useUserInfo';

export function useRequestDialog(room: Room | null, onClose: () => void) {
  const [view, setView] = useState<'categories' | 'items'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { isSubmitting, handleSubmitRequests } = useRequestSubmission();
  const { getRoomInfo } = useUserInfo(room);

  // Set the dialog title and description based on the current view
  const dialogTitle = view === 'categories' 
    ? 'Choose Request Category' 
    : selectedCategory?.name || 'Select Items';
    
  const dialogDescription = view === 'categories'
    ? 'Select the type of service you need'
    : 'Choose items to request';

  // Handle selecting a category
  const handleSelectCategory = useCallback((category: any) => {
    setSelectedCategory(category);
    setSelectedItems([]);
    setView('items');
  }, []);

  // Set initial category from URL or other sources
  const setInitialCategory = useCallback((categoryId: string) => {
    // Find the category by ID or create a simple one if needed
    const categoryMap: Record<string, any> = {
      'housekeeping': {
        id: 'housekeeping',
        name: 'Housekeeping',
        description: 'Room cleaning, fresh towels, and other room services'
      },
      'maintenance': {
        id: 'maintenance',
        name: 'Maintenance',
        description: 'Technical issues, repairs, and facility maintenance'
      },
      'reception': {
        id: 'reception',
        name: 'Reception',
        description: 'Check-in/out, information, and general assistance'
      }
    };
    
    const category = categoryMap[categoryId];
    if (category) {
      handleSelectCategory(category);
    }
  }, [handleSelectCategory]);

  // Go back to the categories view
  const handleGoBackToCategories = useCallback(() => {
    setView('categories');
    setSelectedCategory(null);
    setSelectedItems([]);
  }, []);

  // Toggle an item selection
  const handleToggleRequestItem = useCallback((itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  }, []);

  // Submit the request
  const handleSubmitRequest = useCallback(async () => {
    if (!selectedCategory) return;
    
    const roomInfo = getRoomInfo();
    
    try {
      await handleSubmitRequests(
        selectedCategory.id,
        selectedItems,
        roomInfo
      );
      onClose();
    } catch (error) {
      console.error('Error submitting requests:', error);
    }
  }, [selectedCategory, selectedItems, handleSubmitRequests, getRoomInfo, onClose]);

  // Close the dialog and reset the state
  const handleDialogClose = useCallback(() => {
    setView('categories');
    setSelectedCategory(null);
    setSelectedItems([]);
    onClose();
  }, [onClose]);

  return {
    view,
    selectedCategory,
    selectedItems,
    isSubmitting,
    dialogTitle,
    dialogDescription,
    handleSelectCategory,
    handleGoBackToCategories,
    handleToggleRequestItem,
    handleSubmitRequests: handleSubmitRequest,
    handleDialogClose,
    setInitialCategory
  };
}
