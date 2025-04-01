
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Contact, Message } from '@/types/messaging';

const defaultContacts: Contact[] = [
  {
    id: '2',
    name: 'Concierge',
    role: 'Available 8AM-10PM',
    icon: null, // Will be set in the component
    isOnline: true,
    messages: [],
  }
];

export function useMessaging() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(defaultContacts);
  const [contactsData, setContactsData] = useState<Contact[]>(defaultContacts);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fromLocation = location.state?.from || '/';
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with contact from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const contactId = params.get('contact');
    
    if (contactId) {
      const contact = contactsData.find(c => c.id === contactId);
      if (contact) {
        setSelectedContact(contact);
      }
    }
  }, [location, contactsData]);

  // Update URL when selected contact changes
  useEffect(() => {
    if (selectedContact) {
      navigate(`/messages?contact=${selectedContact.id}`, { 
        replace: true,
        state: { from: location.state?.from || '/' }
      });
    } else {
      navigate('/messages', { replace: true });
    }
  }, [selectedContact, navigate, location.state?.from]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
    if (selectedContact) {
      inputRef.current?.focus();
    }
  }, [selectedContact?.messages]);

  // Filter contacts based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredContacts(contactsData);
    } else {
      const filtered = contactsData.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        contact.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchTerm, contactsData]);

  // Fetch messages from Supabase
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem('user_id');
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

  useEffect(() => {
    fetchMessages();
  }, [toast]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() && selectedContact) {
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
          userName = userData.name || 'Guest';
          roomNumber = userData.roomNumber || '';
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

        // Simulate response after a short delay
        setTimeout(async () => {
          const responseMessage: Message = {
            id: Date.now().toString(),
            text: "Thank you for your message. We'll get back to you shortly.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'staff'
          };
          
          const updatedContactsWithResponse = contactsData.map(contact => {
            if (contact.id === selectedContact.id) {
              return {
                ...contact,
                messages: [...contact.messages, newMessage, responseMessage],
                lastMessage: responseMessage.text
              };
            }
            return contact;
          });
          
          setContactsData(updatedContactsWithResponse);
          
          const contactWithResponse = updatedContactsWithResponse.find(
            contact => contact.id === selectedContact.id
          );
          
          if (contactWithResponse) {
            setSelectedContact(contactWithResponse);
            setFilteredContacts(
              filteredContacts.map(contact => 
                contact.id === selectedContact.id ? contactWithResponse : contact
              )
            );
          }
          
          // Save response to Supabase
          await supabase
            .from('chat_messages')
            .insert([{
              user_id: userId,
              recipient_id: userId,
              user_name: selectedContact.name,
              room_number: roomNumber,
              text: responseMessage.text,
              sender: 'staff',
              status: 'sent',
              created_at: new Date().toISOString()
            }]);
        }, 1000);
      } catch (error) {
        console.error("Error in handleSendMessage:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleGoBack = () => {
    if (selectedContact) {
      setSelectedContact(null);
      navigate('/messages', { 
        replace: true,
        state: { from: fromLocation } 
      });
    } else {
      navigate(fromLocation || '/', { replace: true });
    }
  };

  return {
    selectedContact,
    inputMessage,
    setInputMessage,
    searchTerm,
    setSearchTerm,
    filteredContacts,
    isLoading,
    messagesEndRef,
    inputRef,
    fromLocation,
    handleSendMessage,
    handleGoBack,
    fetchMessages,
    setSelectedContact
  };
}
