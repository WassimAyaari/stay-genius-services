import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserInfo } from '../types/userInfo';
import { RequestCategory } from '@/features/rooms/types';
import { submitRequestViaChatMessage } from '../utils/requestSubmissionUtils';
import { supabase } from '@/integrations/supabase/client';
import { syncGuestData } from '@/features/users/services/guestService';

export function usePresetRequestHandler() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePresetRequest = async (
    preset: {category: string, description: string, type: string},
    userInfo: UserInfo,
    selectedCategory: RequestCategory | null,
    onClose: () => void
  ) => {
    try {
      setIsSubmitting(true);
      
      // Get authenticated user
      const { data: authData } = await supabase.auth.getSession();
      const userId = authData.session?.user.id || localStorage.getItem('user_id');
      
      // Ensure user data is synced with guests table
      if (userId) {
        // Create user data object to sync
        const userData = {
          id: userId,
          email: authData.session?.user.email || userInfo.email || '',
          first_name: userInfo.name.split(' ')[0] || '',
          last_name: userInfo.name.split(' ').slice(1).join(' ') || '',
          room_number: userInfo.roomNumber || '',
          phone: userInfo.phone || ''
        };
        
        // Sync to guests table
        await syncGuestData(userId, userData);
      }
      
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

  return {
    isSubmitting,
    handlePresetRequest
  };
}
