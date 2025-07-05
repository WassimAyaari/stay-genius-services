
import { Message, Contact } from '@/types/messaging';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Function to trigger AI response
const triggerAIResponse = async (userMessage: string, userId: string | null, userName: string, roomNumber: string) => {
  try {
    const response = await supabase.functions.invoke('ai-chat-response', {
      body: {
        userMessage,
        userId,
        userName,
        roomNumber
      }
    });
    
    if (response.error) {
      console.error('Error calling AI chat function:', response.error);
    }
  } catch (error) {
    console.error('Error triggering AI response:', error);
  }
};

export const scrollToBottom = (messagesEndRef: React.RefObject<HTMLDivElement>) => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

export const fetchMessages = async (
  userId: string | null,
  setIsLoading: (loading: boolean) => void,
  setContactsData: (contacts: Contact[]) => void,
  setFilteredContacts: (contacts: Contact[]) => void,
  setSelectedContact: (contact: Contact | null) => void,
  selectedContact: Contact | null,
  defaultContacts: Contact[],
  toast: ReturnType<typeof useToast>['toast']
) => {
  setIsLoading(true);
  try {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const { data: messagesData, error } = await supabase
      .from('chat_messages')
      .select('*')
      .or(`user_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Initialize with default contacts
    const updatedContacts = [...defaultContacts];
    
    if (messagesData && messagesData.length > 0) {
      // Extract and format all messages for the Concierge contact (id: '2')
      const conciergeMessages: Message[] = messagesData.map(msg => ({
        id: msg.id,
        text: msg.text,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: msg.sender as 'user' | 'staff',
        status: msg.status as 'sent' | 'delivered' | 'read' | undefined
      }));
      
      // Update the Concierge contact with messages
      updatedContacts[0].messages = conciergeMessages;
      
      // Set last message if there are messages
      if (conciergeMessages.length > 0) {
        updatedContacts[0].lastMessage = conciergeMessages[conciergeMessages.length - 1].text;
      }
    }
    
    setContactsData(updatedContacts);
    setFilteredContacts(updatedContacts);
    
    // Update the selected contact if it exists
    if (selectedContact) {
      const updatedSelectedContact = updatedContacts.find(c => c.id === selectedContact.id);
      if (updatedSelectedContact) {
        setSelectedContact(updatedSelectedContact);
      }
    }
  } catch (err) {
    console.error('Error in message fetching:', err);
    toast({
      title: 'Error',
      description: 'An unexpected error occurred. Please try again.',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};

export const sendMessage = async (
  inputMessage: string,
  selectedContact: Contact,
  contactsData: Contact[],
  setContactsData: (contacts: Contact[]) => void,
  setSelectedContact: (contact: Contact | null) => void,
  filteredContacts: Contact[],
  setFilteredContacts: (contacts: Contact[]) => void,
  setInputMessage: (message: string) => void,
  fetchMessagesFunction: () => void,
  toast: ReturnType<typeof useToast>['toast']
) => {
  if (!inputMessage.trim() || !selectedContact) return;
  
  const newMessage: Message = {
    id: Date.now().toString(),
    text: inputMessage,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sender: 'user',
    status: 'sent'
  };

  // Update UI first for responsiveness
  const updatedContacts = contactsData.map(contact => {
    if (contact.id === selectedContact.id) {
      return {
        ...contact,
        messages: [...contact.messages, newMessage],
        lastMessage: inputMessage
      };
    }
    return contact;
  });

  setContactsData(updatedContacts);
  setSelectedContact(updatedContacts.find(c => c.id === selectedContact.id) || null);
  setFilteredContacts(
    filteredContacts.map(contact => contact.id === selectedContact.id ? updatedContacts.find(c => c.id === selectedContact.id)! : contact)
  );
  
  setInputMessage('');
  
  // Get user info
  const userDataString = localStorage.getItem('user_data');
  const userId = localStorage.getItem('user_id');
  let userName = 'Guest';
  let roomNumber = '';
  
  if (userDataString) {
    try {
      const userData = JSON.parse(userDataString);
      userName = userData.name || userData.first_name || 'Guest';
      roomNumber = userData.roomNumber || userData.room_number || '';
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  // Save to Supabase
  try {
    const { error } = await supabase
      .from('chat_messages')
      .insert([{
        user_id: userId,
        recipient_id: null,
        user_name: userName,
        room_number: roomNumber,
        text: inputMessage,
        sender: 'user',
        status: 'sent',
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error("Error saving message:", error);
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive"
      });
      return;
    }

    // Trigger AI response
    await triggerAIResponse(inputMessage, userId, userName, roomNumber);
    
    // After successful send, fetch updated messages to see if there are any responses
    setTimeout(() => {
      fetchMessagesFunction();
    }, 1000); // Small delay to allow AI response to be processed
  } catch (error) {
    console.error("Error in sendMessage:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive"
    });
  }
};
