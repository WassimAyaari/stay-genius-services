
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Room } from '@/hooks/useRoom';
import { submitRequestViaChatMessage } from '../utils/requestUtils';

export function usePresetRequestHandler() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePresetRequest = async (requestType: string, description: string, room?: Room | null) => {
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
      let userName = 'Guest';
      let roomNumber = room?.room_number || '';
      
      if (userInfoString) {
        try {
          const userData = JSON.parse(userInfoString);
          userName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Guest';
          roomNumber = userData.room_number || (room?.room_number || '');
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      // Validate room number
      if (!roomNumber) {
        toast.error('Room number is required. Please try again.');
        setIsSubmitting(false);
        return false;
      }

      // Create a service request
      const { error } = await supabase.from('service_requests').insert({
        guest_id: userId,
        guest_name: userName,
        room_number: roomNumber,
        room_id: userId, // Use userId as the room_id to satisfy the not-null constraint
        type: requestType,
        description,
        status: 'pending',
        created_at: new Date().toISOString()
      });

      if (error) {
        console.error('Error creating service request:', error);
        throw error;
      }

      // Submit the request via chat message as well
      await submitRequestViaChatMessage(
        `${requestType} request: ${description}`, 
        userId, 
        userName, 
        roomNumber
      );

      toast.success('Your request has been submitted!');
      return true;
    } catch (error) {
      console.error('Error submitting preset request:', error);
      toast.error('Failed to submit your request. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handlePresetRequest
  };
}
