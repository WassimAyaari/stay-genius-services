import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserInfo } from './useUserInfo';
import { requestService } from '@/features/rooms/controllers/roomService';
import { RequestCategory } from '@/features/rooms/types';

export function useRequestSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Function to submit requests via chat messages
  const submitRequestViaChatMessage = async (
    description: string, 
    type: string, 
    userInfo: UserInfo,
    selectedCategory?: RequestCategory | null
  ) => {
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
      console.log("Submitting chat message for request:", {
        userId,
        userName: userInfo.name || 'Guest',
        roomNumber: userInfo.roomNumber,
        text: description,
        type: type
      });
      
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
      
      // Try to fetch the room
      try {
        const { data: roomData } = await supabase
          .from('rooms')
          .select('id')
          .eq('room_number', userInfo.roomNumber)
          .maybeSingle();
          
        if (roomData) {
          console.log("Room found, submitting service request:", {
            roomId: roomData.id,
            type,
            description,
            categoryId: selectedCategory?.id,
            guestName: userInfo.name, 
            roomNumber: userInfo.roomNumber
          });
          
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
        } else {
          console.warn("Room not found for number:", userInfo.roomNumber);
          
          // Even if room is not found, still create a service request
          console.log("Creating service request without room_id");
          await supabase
            .from('service_requests')
            .insert({
              guest_id: userId,
              guest_name: userInfo.name || 'Guest',
              room_number: userInfo.roomNumber,
              type: type,
              description: description,
              category_id: selectedCategory?.id,
              status: 'pending',
              created_at: new Date().toISOString()
            });
        }
      } catch (err) {
        console.error("Error fetching room by number:", err);
      }
      
      return true;
    } catch (error) {
      console.error("Error submitting request via chat:", error);
      return false;
    }
  };

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
    submitRequestViaChatMessage,
    handlePresetRequest,
    handleSubmitRequests
  };
}
