
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Contact } from '@/types/messaging';
import { defaultContacts } from './messaging/defaultData';
import { fetchMessages as fetchMessagesUtil, sendMessage, scrollToBottom } from './messaging/messageUtils';
import { useRealtimeMessages } from './messaging/useRealtimeMessages';
import { useMessagingNavigation } from './messaging/useMessagingNavigation';

export function useMessaging() {
  const { toast } = useToast();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(defaultContacts);
  const [contactsData, setContactsData] = useState<Contact[]>(defaultContacts);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Memoize fetchMessages to prevent infinite useEffect loops
  const fetchMessages = useCallback(() => {
    const userId = localStorage.getItem('user_id');
    fetchMessagesUtil(
      userId, 
      setIsLoading, 
      setContactsData, 
      setFilteredContacts, 
      setSelectedContact, 
      selectedContact, 
      defaultContacts, 
      toast
    );
  }, [selectedContact, toast]);

  // Connect real-time updates
  useRealtimeMessages({ fetchMessages });

  // Handle navigation and URL
  const { handleGoBack, fromLocation } = useMessagingNavigation({
    selectedContact,
    setSelectedContact,
    contactsData
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom(messagesEndRef);
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

  // Initial fetch and polling
  useEffect(() => {
    console.log('useMessaging: Initial setup, contactsData length:', contactsData.length);
    fetchMessages();
    
    // Set up a polling interval to fetch messages periodically
    const interval = setInterval(() => {
      fetchMessages();
    }, 10000); // Fetch every 10 seconds
    
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSendMessage = () => {
    console.log('Attempting to send message:', inputMessage, 'Selected contact:', selectedContact?.name);
    if (selectedContact && inputMessage.trim()) {
      sendMessage(
        inputMessage,
        selectedContact,
        contactsData,
        setContactsData,
        setSelectedContact,
        filteredContacts,
        setFilteredContacts,
        setInputMessage,
        fetchMessages,
        toast
      );
    } else {
      console.log('Cannot send message - missing contact or empty message');
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
