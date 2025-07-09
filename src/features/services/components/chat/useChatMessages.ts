
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'user' | 'staff';
  status?: 'sent' | 'delivered' | 'read';
}

interface UserInfo {
  name: string;
  roomNumber: string;
}

export const useChatMessages = (userInfo: UserInfo) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Set up userId at component mount
  useEffect(() => {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('user_id', userId);
    }
    
    // Store user data for future reference
    const userData = {
      first_name: userInfo.name.split(' ')[0],
      last_name: userInfo.name.split(' ').slice(1).join(' '),
      room_number: userInfo.roomNumber
    };
    localStorage.setItem('user_data', JSON.stringify(userData));
  }, [userInfo]);

  // Fetch messages when chat opens
  useEffect(() => {
    fetchMessages();
    
    // If no messages are found, add welcome message
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        text: `Welcome to Hotel Genius, ${userInfo.name}! How may I assist you today?`,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        sender: 'staff'
      }]);
    }
  }, [userInfo.name]);
  
  // Set up realtime subscription for new messages
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;
    
    const subscription = supabase
      .channel('service_chat')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `recipient_id=eq.${userId}`,
      }, (payload) => {
        console.log('New message received:', payload);
        fetchMessages();
        
        // Notify user of new message if the sender is staff
        if (payload.new && payload.new.sender === 'staff') {
          toast({
            title: "New message",
            description: "You have received a response from our concierge team."
          });
        }
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [messages]);

  // Fetch messages from database
  const fetchMessages = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`user_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          text: msg.text,
          sender: msg.sender as 'user' | 'staff',
          time: new Date(msg.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          status: msg.status as 'sent' | 'delivered' | 'read' | undefined
        }));
        
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      time: formattedTime,
      sender: 'user',
      status: 'sent'
    };
    setMessages([...messages, newMessage]);
    const userMessage = inputMessage;
    setInputMessage('');

    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('user_id', userId);
    }
    
    const userData = {
      first_name: userInfo.name.split(' ')[0],
      last_name: userInfo.name.split(' ').slice(1).join(' '),
      room_number: userInfo.roomNumber
    };
    localStorage.setItem('user_data', JSON.stringify(userData));
    
    try {
      const { error: chatError } = await supabase
        .from('chat_messages')
        .insert([{
          user_id: userId,
          user_name: userInfo.name,
          room_number: userInfo.roomNumber,
          text: userMessage,
          sender: 'user',
          status: 'sent',
          created_at: currentTime.toISOString()
        }]);
      
      if (chatError) {
        console.error("Error saving message:", chatError);
        toast({
          title: "Error",
          description: "Failed to send your message. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Call AI booking assistant for intelligent responses
      setIsAiTyping(true);
      try {
        const { data: aiResponse } = await supabase.functions.invoke('ai-chat-booking', {
          body: {
            message: userMessage,
            userInfo: {
              userId,
              name: userInfo.name,
              roomNumber: userInfo.roomNumber
            },
            context: messages.map(m => `${m.sender}: ${m.text}`).join('\n')
          }
        });

        if (aiResponse?.response) {
          // AI response is already saved by the edge function
          setTimeout(() => {
            fetchMessages();
            setIsAiTyping(false);
          }, 1000);
        } else {
          setIsAiTyping(false);
        }
      } catch (aiError) {
        console.error("AI response error:", aiError);
        setIsAiTyping(false);
        // Continue with basic keyword-based service request creation as fallback
      }
      
      if (userMessage.toLowerCase().includes('request') || 
          userMessage.toLowerCase().includes('service') ||
          userMessage.toLowerCase().includes('clean') ||
          userMessage.toLowerCase().includes('laundry') ||
          userMessage.toLowerCase().includes('help') ||
          userMessage.toLowerCase().includes('need')) {
        
        let requestType = 'general';
        if (userMessage.toLowerCase().includes('clean')) requestType = 'cleaning';
        else if (userMessage.toLowerCase().includes('laundry')) requestType = 'laundry';
        else if (userMessage.toLowerCase().includes('maintenance')) requestType = 'maintenance';
        else if (userMessage.toLowerCase().includes('food') || userMessage.toLowerCase().includes('meal')) requestType = 'food';
        
        // Get room_id or use userId as fallback
        const { data: roomData } = await supabase
          .from('rooms')
          .select('id')
          .eq('room_number', userInfo.roomNumber)
          .maybeSingle();
          
        const roomId = roomData?.id || userId;
        
        // Add a valid room_id that's required by the service_requests table
        await supabase.from('service_requests').insert({
          guest_id: userId,
          guest_name: userInfo.name,
          room_number: userInfo.roomNumber,
          room_id: roomId,
          type: requestType,
          description: userMessage,
          status: 'pending',
          created_at: currentTime.toISOString()
        });
      }
      
      // Check for new messages after sending (in case of automatic replies)
      setTimeout(() => {
        fetchMessages();
      }, 1000);
      
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return {
    inputMessage,
    setInputMessage,
    messages,
    isAiTyping,
    messagesEndRef,
    handleSendMessage,
    handleMessageSubmit,
    fetchMessages, // Add the fetchMessages function to the returned object
  };
};
