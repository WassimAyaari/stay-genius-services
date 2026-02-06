import { useState, useEffect, useRef, useCallback } from 'react';
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
  conversationType?: 'concierge' | 'safety_ai';
  conversationId?: string; // NEW: Load specific conversation by ID (for admin)
}

export const useUnifiedChat = ({ 
  userInfo, 
  isAdmin = false, 
  conversationType = 'concierge',
  conversationId 
}: UseUnifiedChatProps) => {
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

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load a specific conversation by ID (for admin use)
  const loadConversationById = useCallback(async (id: string) => {
    try {
      setChatState(prev => ({ ...prev, isLoading: true }));

      // Load the conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', id)
        .single();

      if (convError) throw convError;

      // Load messages
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', id)
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
      console.error('Error loading conversation:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation.",
        variant: "destructive"
      });
      setChatState(prev => ({ ...prev, isLoading: false }));
    }
  }, [toast]);

  // Initialize conversation for guests
  const initializeConversation = useCallback(async () => {
    try {
      setChatState(prev => ({ ...prev, isLoading: true }));

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Check for existing active conversation of the same type
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('*')
        .eq('guest_id', user.user.id)
        .eq('conversation_type', conversationType)
        .eq('status', 'active')
        .maybeSingle();

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
            current_handler: conversationType === 'concierge' ? 'human' : 'ai',
            conversation_type: conversationType
          })
          .select()
          .single();

        if (error) throw error;
        conversation = newConversation;

        // Send welcome message based on conversation type
        const welcomeMessage = conversationType === 'safety_ai' 
          ? `Hello ${userInfo?.name || 'there'}! I'm your AI Assistant. I can help with bookings, hotel information, and much more. If you need human assistance, I can connect you to our staff. How can I help you today?`
          : `Hello ${userInfo?.name || 'there'}! Welcome to our Hotel Team chat. Our staff will assist you directly with any questions or requests you may have.`;

        await supabase
          .from('messages')
          .insert({
            conversation_id: conversation.id,
            sender_type: conversationType === 'concierge' ? 'staff' : 'ai',
            sender_name: conversationType === 'safety_ai' ? 'AI Assistant' : 'Hotel Team',
            content: welcomeMessage,
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
  }, [userInfo, conversationType, toast]);

  // Initialize or load conversation
  useEffect(() => {
    if (conversationId) {
      // Admin loading a specific conversation
      loadConversationById(conversationId);
    } else if (userInfo?.name) {
      // Guest creating/loading their own conversation
      initializeConversation();
    }
  }, [conversationId, userInfo?.name, conversationType, loadConversationById, initializeConversation]);

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
          setChatState(prev => {
            // Prevent duplicate messages
            if (prev.messages.some(m => m.id === newMessage.id)) {
              return prev;
            }
            return {
              ...prev,
              messages: [...prev.messages, newMessage],
              isTyping: false
            };
          });
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
  }, [chatState.conversation?.id, scrollToBottom]);

  // Polling fallback with exponential backoff
  useEffect(() => {
    if (!chatState.conversation?.id) return;

    let pollInterval = 3000; // Start at 3 seconds
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastMessageTime = chatState.messages.length > 0
      ? chatState.messages[chatState.messages.length - 1].created_at
      : '1970-01-01';

    const poll = async () => {
      try {
        const { data } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', chatState.conversation!.id)
          .gt('created_at', lastMessageTime)
          .order('created_at', { ascending: true });

        if (data && data.length > 0) {
          // New messages found - update state
          setChatState(prev => ({
            ...prev,
            messages: [...prev.messages, ...data.filter(
              msg => !prev.messages.some(existing => existing.id === msg.id)
            )],
            isTyping: false
          }));
          lastMessageTime = data[data.length - 1].created_at;
          pollInterval = 3000; // Reset interval on new messages
        } else {
          // No new messages - increase interval (max 15 seconds)
          pollInterval = Math.min(pollInterval * 1.5, 15000);
        }
      } catch (error) {
        console.error('Polling error:', error);
        pollInterval = Math.min(pollInterval * 1.5, 15000);
      } finally {
        timeoutId = setTimeout(poll, pollInterval);
      }
    };

    timeoutId = setTimeout(poll, pollInterval);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [chatState.conversation?.id]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, scrollToBottom]);

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

      // If current handler is AI and conversation type is safety_ai, send to AI
      if (chatState.currentHandler === 'ai' && !isAdmin && chatState.conversation.conversation_type === 'safety_ai') {
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
  const takeOverConversation = async (targetConversationId?: string) => {
    const convId = targetConversationId || chatState.conversation?.id;
    if (!convId) return;

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
        .eq('id', convId);

      // Log the routing change
      await supabase
        .from('chat_routing')
        .insert({
          conversation_id: convId,
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
