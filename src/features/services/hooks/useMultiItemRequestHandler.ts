
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserInfo } from './useUserInfo';
import { RequestCategory, RequestItem } from '@/features/rooms/types';
import { supabase } from '@/integrations/supabase/client';

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
      // First check if room number exists and get the room_id
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('id')
        .eq('room_number', userInfo.roomNumber)
        .maybeSingle();
      
      if (roomError) {
        console.error("Error fetching room:", roomError);
        throw roomError;
      }
      
      if (!roomData) {
        console.error("Room not found:", userInfo.roomNumber);
        toast({
          title: "Room not found",
          description: `Room ${userInfo.roomNumber} does not exist in our system.`,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Create a request for each selected item
      const selectedItemData = categoryItems.filter(item => selectedItems.includes(item.id));
      
      // First, create a chat message that summarizes all requests
      const itemNames = selectedItemData.map(item => item.name).join(', ');
      const categoryName = selectedCategory?.name || 'items';
      const chatMessage = `Requesting ${categoryName}: ${itemNames}`;
      
      await supabase
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
      
      // Then create individual service requests for each item
      const requests = selectedItemData.map(item => ({
        guest_id: userId,
        room_id: roomData.id,
        type: 'custom', // Using 'custom' as the generic type
        description: item.name,
        category_id: selectedCategory?.id,
        request_item_id: item.id,
        status: 'pending',
        created_at: new Date().toISOString()
      }));
      
      const { error: batchError } = await supabase
        .from('service_requests')
        .insert(requests);
      
      if (batchError) {
        console.error("Error submitting batch requests:", batchError);
        throw batchError;
      }
      
      toast({
        title: "Requests Submitted",
        description: `${requests.length} requests have been sent successfully.`
      });
      
      onClose();
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
