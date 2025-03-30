
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RequestCategory, RequestItem } from '@/features/rooms/types';
import { requestService, ServiceType } from '@/features/rooms/controllers/roomService';
import { Room } from '@/hooks/useRoom';
import { useRequestItems } from '@/hooks/useRequestCategories';
import { supabase } from '@/integrations/supabase/client';

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
          // Format full name from first_name and last_name fields
          const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
          // Get room number from userData or fall back to room prop
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
    // Store user info in local storage with proper fields
    const userDataToSave = {
      first_name: info.name.split(' ')[0],
      last_name: info.name.split(' ').slice(1).join(' '),
      room_number: info.roomNumber
    };
    
    localStorage.setItem('user_data', JSON.stringify(userDataToSave));
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

  // Function to submit requests via chat messages
  const submitRequestViaChatMessage = async (description: string, type: string) => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      toast({
        title: "User ID missing",
        description: "Unable to submit request without user identification.",
        variant: "destructive"
      });
      return false;
    }

    // Make sure we have room number - display error if missing
    if (!userInfo.roomNumber) {
      toast({
        title: "Room information missing",
        description: "Unable to submit request without room number.",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Insert the request as a chat message
      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          user_id: userId,
          recipient_id: null,
          user_name: userInfo.name || 'Guest',
          room_number: userInfo.roomNumber,
          text: description,
          sender: 'user',
          status: 'sent',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      
      // Get room ID if available
      const roomId = room?.id;
      
      // If we don't have room ID but have room number, try to fetch the room
      if (!roomId && userInfo.roomNumber) {
        try {
          const { data: roomData } = await supabase
            .from('rooms')
            .select('id')
            .eq('room_number', userInfo.roomNumber)
            .maybeSingle();
            
          if (roomData) {
            // Also insert into service_requests table for tracking purposes
            await requestService(
              roomData.id, 
              type as any, 
              description, 
              undefined, 
              selectedCategory?.id, 
              userInfo.name, 
              userInfo.roomNumber
            );
            return true;
          }
        } catch (err) {
          console.error("Error fetching room by number:", err);
        }
      } else if (roomId) {
        // If we have room ID, use it directly
        await requestService(
          roomId, 
          type as any, 
          description, 
          undefined, 
          selectedCategory?.id, 
          userInfo.name, 
          userInfo.roomNumber
        );
        return true;
      }
      
      // If we couldn't get room ID but chat message was sent, consider it a success
      return true;
    } catch (error) {
      console.error("Error submitting request via chat:", error);
      return false;
    }
  };

  const handlePresetRequest = async (preset: {category: string, description: string, type: string}) => {
    if (!userInfo.name || !userInfo.roomNumber) {
      setIsUserInfoDialogOpen(true);
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Submit request via chat message
      const success = await submitRequestViaChatMessage(
        preset.description,
        preset.type
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
          selectedCategory?.name.toLowerCase() || 'custom'
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
        
        // Clear selections and close dialog after successful submission
        setSelectedItems([]);
        setSelectedCategory(null);
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
