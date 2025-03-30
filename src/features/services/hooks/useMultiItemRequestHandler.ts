
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserInfo } from './useUserInfo';
import { RequestCategory, RequestItem } from '@/features/rooms/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates a user profile in the database if it doesn't exist
 */
const createUserProfile = async (userId: string, userInfo: UserInfo) => {
  try {
    // Extract first and last name from full name
    const nameParts = userInfo.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Insert the profile
    const { error } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        first_name: firstName,
        last_name: lastName
      }]);
    
    if (error) {
      console.error("Error inserting profile:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in createUserProfile:", error);
    return false;
  }
};

export function useMultiItemRequestHandler() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitRequests = async (
    selectedItems: string[],
    categoryItems: RequestItem[] | undefined,
    userInfo: UserInfo,
    selectedCategory: RequestCategory | null,
    onClose: () => void
  ) => {
    if (!selectedItems.length || !categoryItems) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to request.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const userId = localStorage.getItem('user_id');

    if (!userId) {
      toast({
        title: "User ID missing",
        description: "Unable to submit request without user identification.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Step 1: Try to create user profile if it doesn't exist (but don't block if it fails)
      try {
        await createUserProfile(userId, userInfo);
      } catch (profileError) {
        console.warn("Failed to create profile, but continuing with request", profileError);
        // Continue despite profile creation failure
      }
      
      // Step 2: Create a chat message that summarizes all requests
      const selectedItemData = categoryItems.filter(item => selectedItems.includes(item.id));
      const itemNames = selectedItemData.map(item => item.name).join(', ');
      const categoryName = selectedCategory?.name || 'items';
      const chatMessage = `Requesting ${categoryName}: ${itemNames}`;
      
      const { error: chatError } = await supabase
        .from('chat_messages')
        .insert([{
          user_id: userId,
          recipient_id: null,
          user_name: userInfo.name || 'Guest',
          room_number: userInfo.roomNumber,
          text: chatMessage,
          sender: 'user',
          status: 'sent',
          created_at: new Date().toISOString()
        }]);
      
      if (chatError) {
        console.error("Error creating chat message:", chatError);
        throw chatError;
      }
      
      // Step 3: Check if room exists and get room_id
      const { data: roomData } = await supabase
        .from('rooms')
        .select('id')
        .eq('room_number', userInfo.roomNumber)
        .maybeSingle();
      
      // Step 4: Try to create service requests for each item
      let successful = 0;
      let failed = 0;
      
      for (const item of selectedItemData) {
        try {
          const requestData = {
            guest_id: userId,
            type: 'custom',
            description: item.name,
            category_id: selectedCategory?.id,
            request_item_id: item.id,
            status: 'pending',
            created_at: new Date().toISOString()
          };
          
          // Add room_id only if the room exists
          if (roomData?.id) {
            Object.assign(requestData, { room_id: roomData.id });
          }
          
          const { error } = await supabase
            .from('service_requests')
            .insert([requestData]);
            
          if (error) {
            console.error(`Error submitting request for item ${item.name}:`, error);
            failed++;
          } else {
            successful++;
          }
        } catch (itemError) {
          console.error(`Error processing item ${item.name}:`, itemError);
          failed++;
        }
      }
      
      // Show appropriate toast based on results
      if (successful > 0 && failed === 0) {
        toast({
          title: "Requests Submitted",
          description: `${successful} requests have been sent successfully.`
        });
        onClose();
      } else if (successful > 0 && failed > 0) {
        toast({
          title: "Partial Success",
          description: `${successful} requests sent, but ${failed} failed. Your message was delivered.`
        });
        onClose();
      } else {
        toast({
          title: "Requests Failed",
          description: "Failed to submit requests, but your message was delivered.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error submitting multiple requests:", error);
      toast({
        title: "Error",
        description: "Failed to submit requests. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmitRequests
  };
}
