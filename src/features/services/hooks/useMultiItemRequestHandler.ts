
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RoomInfo {
  roomId: string;
  roomNumber: string;
  guestId: string;
  guestName: string;
}

export function useMultiItemRequestHandler() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmitRequests = async (
    categoryId: string,
    selectedItems: string[],
    roomInfo: RoomInfo
  ) => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to request",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create service requests for each selected item
      const requestPromises = selectedItems.map(async (itemId) => {
        let itemDescription = itemId; // Default to the ID if we can't find an item name
        
        // For fixed categories, we can use the item ID directly as the description
        // since they're not coming from the database
        
        const { error } = await supabase
          .from('service_requests')
          .insert({
            guest_id: roomInfo.guestId,
            room_id: roomInfo.roomId,
            guest_name: roomInfo.guestName,
            room_number: roomInfo.roomNumber,
            type: categoryId, // Use the category ID (housekeeping, maintenance, etc.)
            description: itemDescription,
            status: 'pending'
          });
          
        if (error) {
          console.error('Error creating service request:', error);
          throw error;
        }
      });
      
      await Promise.all(requestPromises);
      
      toast({
        title: "Requests submitted",
        description: `${selectedItems.length} ${selectedItems.length === 1 ? 'request' : 'requests'} successfully submitted`,
      });
      
    } catch (error) {
      console.error('Error submitting requests:', error);
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
