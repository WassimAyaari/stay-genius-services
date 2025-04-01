
import { supabase } from '@/integrations/supabase/client';

export const submitRequestViaChatMessage = async (
  messageText: string,
  userId: string,
  userName: string,
  roomNumber: string
): Promise<boolean> => {
  try {
    // Insert the chat message only
    const { error: chatError } = await supabase.from('chat_messages').insert({
      user_id: userId,
      user_name: userName,
      room_number: roomNumber,
      text: messageText,
      sender: 'user',
      status: 'sent',
      created_at: new Date().toISOString()
    });

    if (chatError) {
      console.error('Error saving chat message:', chatError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in submitRequestViaChatMessage:', error);
    return false;
  }
};
