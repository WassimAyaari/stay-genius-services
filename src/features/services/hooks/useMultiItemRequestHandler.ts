
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Room } from '@/hooks/useRoom';
import { RequestItem, RequestCategory } from '@/features/rooms/types';
import { submitRequestViaChatMessage } from '../utils/requestUtils';

interface UserInfo {
  name: string;
  roomNumber: string;
  phone?: string;
}

export function useMultiItemRequestHandler() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createUpdateUserProfile = async (userId: string, userInfo: UserInfo): Promise<boolean> => {
    console.info('Creating user profile in useMultiItemRequestHandler:', userId, userInfo);
    
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('guests')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (existingProfile) {
        console.info('Guest profile already exists, skipping creation');
        return true;
      }

      // Create profile if it doesn't exist
      const { error } = await supabase.from('guests').insert({
        user_id: userId,
        first_name: userInfo.name.split(' ')[0],
        last_name: userInfo.name.split(' ').slice(1).join(' '),
        room_number: userInfo.roomNumber,
        phone: userInfo.phone || null,
        status: 'active',
        guest_type: 'Guest'
      });

      if (error) {
        console.error('Error creating guest profile:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in createUpdateUserProfile:', error);
      return false;
    }
  };

  const handleSubmitRequests = async (
    selectedItems: RequestItem[],
    category: RequestCategory,
    room?: Room | null
  ) => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item');
      return false;
    }

    setIsSubmitting(true);

    try {
      // Get or create user ID
      let userId = localStorage.getItem('user_id');
      if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem('user_id', userId);
      }

      // Get user info from localStorage
      const userInfoString = localStorage.getItem('user_data');
      let userInfo: UserInfo;
      
      if (userInfoString) {
        try {
          const parsedData = JSON.parse(userInfoString);
          userInfo = {
            name: `${parsedData.first_name || ''} ${parsedData.last_name || ''}`.trim() || 'Guest',
            roomNumber: parsedData.room_number || (room?.room_number || ''),
            phone: parsedData.phone || ''
          };
        } catch (e) {
          userInfo = {
            name: 'Guest',
            roomNumber: room?.room_number || '',
            phone: ''
          };
        }
      } else {
        userInfo = {
          name: 'Guest',
          roomNumber: room?.room_number || '',
          phone: ''
        };
      }

      console.info('Retrieved user info from localStorage:', userInfo);

      // Validate user info
      if (!userInfo.name || !userInfo.roomNumber) {
        toast.error('Missing user information. Please try again.');
        setIsSubmitting(false);
        return false;
      }

      console.info('User info already valid:', userInfo);

      // Create a chat message for the selected items
      const itemsText = selectedItems.map(item => item.name).join(', ');
      const messageText = `Requesting ${category.name}: ${itemsText}`;
      console.info('Creating chat message for multiple items:', messageText);

      // Create/update user profile
      const profileCreated = await createUpdateUserProfile(userId, userInfo);
      console.info('Profile creation result:', profileCreated);

      // Create a service request for each selected item
      for (const item of selectedItems) {
        try {
          console.info('Creating service request for item:', item.name, {
            guest_id: userId,
            type: category.name,
            description: item.name,
            status: 'pending',
            created_at: new Date().toISOString(),
            guest_name: userInfo.name,
            room_number: userInfo.roomNumber,
            category_id: category.id,
            request_item_id: item.id,
            room_id: userId // Use userId as the room_id to satisfy the not-null constraint
          });

          const { error } = await supabase.from('service_requests').insert({
            guest_id: userId,
            type: category.name,
            description: item.name,
            status: 'pending',
            created_at: new Date().toISOString(),
            guest_name: userInfo.name,
            room_number: userInfo.roomNumber,
            category_id: category.id,
            request_item_id: item.id,
            room_id: userId // Use userId as the room_id to satisfy the not-null constraint
          });

          if (error) {
            console.error(`Error submitting request for item ${item.name}:`, error);
            throw error;
          }
        } catch (error) {
          console.error(`Error creating service request for ${item.name}:`, error);
        }
      }

      // Submit the request via chat as well
      await submitRequestViaChatMessage(messageText, userId, userInfo.name, userInfo.roomNumber);

      toast.success('Your requests have been submitted!');
      return true;
    } catch (error) {
      console.error('Error submitting requests:', error);
      toast.error('Failed to submit your requests. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmitRequests
  };
}
