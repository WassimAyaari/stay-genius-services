import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Conversation, Message, ChatState } from '@/types/chat';

interface UseUnifiedChatProps {
  userInfo?: {
    name: string;
    email?: string;
    roomNumber?: string;
  };
  isAdmin?: boolean;
}

export const useUnifiedChat = ({ userInfo, isAdmin = false }: UseUnifiedChatProps) => {
  const [chatState, setChatState] = useState<ChatState>({
    conversation: null,
    messages: [],
    isLoading: true,
    isTyping: false,
    currentHandler: 'ai'
  });
  
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Initialize or get existing conversation
  useEffect(() => {
    if (userInfo?.name) {
      initializeConversation();
    }
  }, [userInfo]);

  // Real-time subscription for messages
  useEffect(() => {
    if (!chatState.conversation?.id) return;

    const channel = supabase
      .channel(`conversation-${chatState.conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${chatState.conversation.id}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setChatState(prev => ({
            ...prev,
            messages: [...prev.messages, newMessage],
            isTyping: false
          }));
          scrollToBottom();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `id=eq.${chatState.conversation.id}`
        },
        (payload) => {
          const updatedConversation = payload.new as Conversation;
          setChatState(prev => ({
            ...prev,
            conversation: updatedConversation,
            currentHandler: updatedConversation.current_handler
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatState.conversation?.id]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  // Initialize conversation
  const initializeConversation = async () => {
    try {
      setChatState(prev => ({ ...prev, isLoading: true }));

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Check for existing active conversation
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('*')
        .eq('guest_id', user.user.id)
        .eq('status', 'active')
        .single();

      let conversation = existingConversation;

      // Create new conversation if none exists
      if (!conversation) {
        const { data: newConversation, error } = await supabase
          .from('conversations')
          .insert({
            guest_id: user.user.id,
            guest_name: userInfo?.name || 'Guest',
            guest_email: userInfo?.email || user.user.email,
            room_number: userInfo?.roomNumber,
            status: 'active',
            current_handler: 'ai'
          })
          .select()
          .single();

        if (error) throw error;
        conversation = newConversation;

        // Send welcome message
        await supabase
          .from('messages')
          .insert({
            conversation_id: conversation.id,
            sender_type: 'ai',
            sender_name: 'AI Assistant',
            content: `Hello ${userInfo?.name || 'there'}! I'm your 24/7 virtual concierge. How can I assist you today? I can help with restaurant reservations, spa bookings, event information, and much more!`,
            message_type: 'text'
          });
      }

      // Load messages
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      setChatState({
        conversation,
        messages: messages || [],
        isLoading: false,
        isTyping: false,
        currentHandler: conversation.current_handler
      });

    } catch (error) {
      console.error('Error initializing conversation:', error);
      toast({
        title: "Error",
        description: "Failed to initialize chat. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim() || !chatState.conversation) return;

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const messageContent = inputMessage.trim();
      setInputMessage('');
      setChatState(prev => ({ ...prev, isTyping: true }));

      // Insert user message
      await supabase
        .from('messages')
        .insert({
          conversation_id: chatState.conversation.id,
          sender_type: isAdmin ? 'staff' : 'guest',
          sender_id: user.user.id,
          sender_name: isAdmin ? 'Staff' : userInfo?.name || 'Guest',
          content: messageContent,
          message_type: 'text'
        });

      // If current handler is AI, send to AI
      if (chatState.currentHandler === 'ai' && !isAdmin) {
        await sendToAI(messageContent);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      setChatState(prev => ({ ...prev, isTyping: false }));
    }
  };

  // Send message to AI
  const sendToAI = async (message: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user || !userInfo) return;

      const response = await supabase.functions.invoke('ai-chat-booking', {
        body: {
          message,
          userId: user.user.id,
          userName: userInfo.name,
          roomNumber: userInfo.roomNumber || 'N/A',
          conversationId: chatState.conversation?.id
        }
      });

      if (response.error) {
        throw response.error;
      }

      // AI response will be inserted via real-time subscription
    } catch (error) {
      console.error('Error communicating with AI:', error);
      setChatState(prev => ({ ...prev, isTyping: false }));
      
      // Insert error message
      await supabase
        .from('messages')
        .insert({
          conversation_id: chatState.conversation!.id,
          sender_type: 'ai',
          sender_name: 'AI Assistant',
          content: 'I apologize, but I encountered an error. A human staff member will assist you shortly.',
          message_type: 'system'
        });

      // Escalate to human
      await escalateToHuman('AI Error');
    }
  };

  // Escalate conversation to human staff
  const escalateToHuman = async (reason: string = 'Guest Request') => {
    if (!chatState.conversation) return;

    try {
      // Update conversation handler
      await supabase
        .from('conversations')
        .update({
          current_handler: 'human',
          status: 'escalated'
        })
        .eq('id', chatState.conversation.id);

      // Log the routing change
      await supabase
        .from('chat_routing')
        .insert({
          conversation_id: chatState.conversation.id,
          from_handler: 'ai',
          to_handler: 'human',
          reason
        });

      // Notify guest
      await supabase
        .from('messages')
        .insert({
          conversation_id: chatState.conversation.id,
          sender_type: 'ai',
          sender_name: 'AI Assistant',
          content: 'I\'m connecting you with a human staff member who will be able to provide more personalized assistance. Please hold on for a moment.',
          message_type: 'system'
        });

      toast({
        title: "Connected to Staff",
        description: "A human staff member will assist you shortly."
      });

    } catch (error) {
      console.error('Error escalating to human:', error);
      toast({
        title: "Error",
        description: "Failed to connect to staff. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Take over conversation (for admin)
  const takeOverConversation = async (conversationId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user || !isAdmin) return;

      await supabase
        .from('conversations')
        .update({
          current_handler: 'human',
          assigned_staff_id: user.user.id,
          status: 'active'
        })
        .eq('id', conversationId);

      // Log the routing change
      await supabase
        .from('chat_routing')
        .insert({
          conversation_id: conversationId,
          from_handler: 'ai',
          to_handler: 'human',
          reason: 'Staff Takeover',
          staff_id: user.user.id
        });

      toast({
        title: "Conversation Taken Over",
        description: "You are now handling this conversation."
      });

    } catch (error) {
      console.error('Error taking over conversation:', error);
      toast({
        title: "Error",
        description: "Failed to take over conversation.",
        variant: "destructive"
      });
    }
  };

  return {
    ...chatState,
    inputMessage,
    setInputMessage,
    sendMessage,
    escalateToHuman,
    takeOverConversation,
    messagesEndRef,
    inputRef
  };
};