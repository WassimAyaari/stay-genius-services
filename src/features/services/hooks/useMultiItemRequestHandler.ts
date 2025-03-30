
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserInfo } from './useUserInfo';
import { RequestCategory, RequestItem } from '@/features/rooms/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates a user profile in the database if it doesn't exist
 */
const createUserProfile = async (userId: string, userInfo: UserInfo) => {
  console.log('Creating user profile in useMultiItemRequestHandler:', userId, userInfo);
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    if (existingProfile) {
      console.log('Profile already exists, skipping creation');
      return true;
    }
    
    // Extract first and last name from full name
    const nameParts = userInfo.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    console.log('Creating new profile with:', {
      id: userId,
      first_name: firstName,
      last_name: lastName
    });
    
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
      // Step 1: Create a chat message that summarizes all requests (doesn't require a profile)
      const selectedItemData = categoryItems.filter(item => selectedItems.includes(item.id));
      const itemNames = selectedItemData.map(item => item.name).join(', ');
      const categoryName = selectedCategory?.name || 'items';
      const chatMessage = `Requesting ${categoryName}: ${itemNames}`;
      
      console.log('Creating chat message for multiple items:', chatMessage);
      
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
      
      // Step 2: Try to create user profile if it doesn't exist
      console.log('Attempting to create/update user profile');
      const profileCreated = await createUserProfile(userId, userInfo);
      console.log('Profile creation result:', profileCreated);
      
      if (!profileCreated) {
        console.warn("Could not create or verify user profile");
        toast({
          title: "Request Sent",
          description: "Your message was sent, but we couldn't register your individual requests. Please contact reception.",
        });
        onClose();
        setIsSubmitting(false);
        return;
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
          const requestData: any = {
            guest_id: userId,
            type: 'custom',
            description: item.name,
            status: 'pending',
            created_at: new Date().toISOString()
          };
          
          // Add category if available
          if (selectedCategory?.id) {
            requestData.category_id = selectedCategory.id;
          }
          
          // Add request item ID
          if (item.id) {
            requestData.request_item_id = item.id;
          }
          
          // Add room_id only if the room exists
          if (roomData?.id) {
            requestData.room_id = roomData.id;
          }
          
          console.log('Creating service request for item:', item.name, requestData);
          
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
          title: "Message Sent",
          description: "Your message was delivered, but we couldn't register your requests. Our staff will assist you.",
          variant: "warning"
        });
        onClose();
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
