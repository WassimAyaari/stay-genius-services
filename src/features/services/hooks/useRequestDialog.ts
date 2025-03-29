
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RequestCategory, RequestItem } from '@/features/rooms/types';
import { requestService } from '@/features/rooms/controllers/roomService';
import { Room } from '@/hooks/useRoom';
import { v4 as uuidv4 } from 'uuid';
import { useRequestItems } from '@/hooks/useRequestCategories';

export interface UserInfo {
  name: string;
  roomNumber: string;
}

export function useRequestDialog(room: Room | null, onClose: () => void) {
  const [view, setView] = useState<'categories' | 'items' | 'presets'>('presets');
  const [selectedCategory, setSelectedCategory] = useState<RequestCategory | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUserInfoDialogOpen, setIsUserInfoDialogOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', roomNumber: '' });
  const { toast } = useToast();
  
  // Fetch items for the selected category
  const { data: categoryItems } = useRequestItems(selectedCategory?.id);

  // Load user profile data when dialog opens
  useEffect(() => {
    loadUserProfileData();
  }, [room]);

  const loadUserProfileData = () => {
    // First try to get user data from localStorage
    const userDataString = localStorage.getItem('user_data');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData) {
          const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
          const roomNumber = userData.room_number || room?.room_number || '';
          
          setUserInfo({
            name: fullName,
            roomNumber: roomNumber
          });
          return;
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    
    // If no user data in localStorage, check for values that might have been set in previous sessions
    const savedUserInfo = getUserInfo();
    setUserInfo(savedUserInfo);
  };

  const getUserInfo = () => {
    const userInfoStr = localStorage.getItem('user_data');
    if (userInfoStr) {
      try {
        const userData = JSON.parse(userInfoStr);
        return {
          name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
          roomNumber: userData.room_number || (room?.room_number || '')
        };
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }
    return {
      name: '',
      roomNumber: room?.room_number || ''
    };
  };

  const saveUserInfo = (info: UserInfo) => {
    localStorage.setItem('user_data', JSON.stringify({
      first_name: info.name.split(' ')[0],
      last_name: info.name.split(' ').slice(1).join(' '),
      room_number: info.roomNumber
    }));
    setUserInfo(info);
    setIsUserInfoDialogOpen(false);
  };

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

  const createUniqueRequestId = () => {
    const name = userInfo.name.trim();
    const roomNumber = userInfo.roomNumber.trim();
    
    if (!name || !roomNumber) {
      // If we don't have complete user info, fall back to UUID
      return uuidv4();
    }
    
    // Create a deterministic ID from user name and room number
    const nameInitials = name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
    
    // Format: RM{roomNumber}-{nameInitials}-{timestamp}
    return `RM${roomNumber}-${nameInitials}-${Date.now()}`;
  };

  const handlePresetRequest = async (preset: {category: string, description: string, type: string}) => {
    if (!userInfo.name || !userInfo.roomNumber) {
      setIsUserInfoDialogOpen(true);
      return;
    }

    // Ensure we have a valid room ID
    const roomId = room?.id;
    if (!roomId) {
      toast({
        title: "Room information missing",
        description: "Unable to submit request without room information.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      await requestService(
        roomId,
        preset.type as any,
        preset.description,
        undefined,
        undefined,
        userInfo.name,
        userInfo.roomNumber
      );
      
      toast({
        title: "Request Submitted",
        description: "Your request has been sent successfully."
      });
      
      onClose();
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

  const handleSubmitRequests = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one request item",
        variant: "destructive"
      });
      return;
    }
    
    if (!userInfo.name || !userInfo.roomNumber) {
      setIsUserInfoDialogOpen(true);
      return;
    }

    // Ensure we have a valid room ID
    const roomId = room?.id;
    if (!roomId) {
      toast({
        title: "Room information missing",
        description: "Unable to submit request without room information.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Submit each selected item
      for (const itemId of selectedItems) {
        // Find the item name for better description
        const itemName = categoryItems?.find(item => item.id === itemId)?.name || 'Unknown Item';
        const categoryName = selectedCategory?.name || 'Custom Request';
        const description = `${categoryName} - ${itemName}`;
        
        await requestService(
          roomId, 
          selectedCategory?.name.toLowerCase() as any || 'custom', 
          description, 
          itemId, 
          selectedCategory?.id, 
          userInfo.name, 
          userInfo.roomNumber
        );
      }
      
      toast({
        title: "Requests Submitted",
        description: `${selectedItems.length} request(s) have been sent successfully.`
      });
      
      // Clear selections and close dialog after successful submission
      setSelectedItems([]);
      setSelectedCategory(null);
      onClose();
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
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setView('presets');
      setSelectedCategory(null);
      setSelectedItems([]);
    }
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
