
import { useState, useEffect } from 'react';
import { Chat } from '@/components/admin/chat/types';
import { useChatFetching } from './useChatFetching';
import { useChatOperations } from './useChatOperations';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/features/rooms/types';

export function useChatMessages() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  
  const [currentTab, setCurrentTab] = useState(tabFromUrl || 'all');
  const { chats, loading, setChats, fetchChats } = useChatFetching();
  const [serviceRequestChats, setServiceRequestChats] = useState<Chat[]>([]);
  
  useEffect(() => {
    if (tabFromUrl) {
      setCurrentTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  
  // Fetch service requests and convert them to chat format
  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('service_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching service requests for messages:', error);
          return;
        }

        const requestChats = convertRequestsToChats(data as ServiceRequest[]);
        setServiceRequestChats(requestChats);
      } catch (error) {
        console.error('Error in fetchServiceRequests:', error);
      }
    };

    fetchServiceRequests();
  }, []);

  // Helper function to convert service requests to chat format
  const convertRequestsToChats = (requests: ServiceRequest[]): Chat[] => {
    const groupedRequests: Record<string, ServiceRequest[]> = {};
    
    // Group requests by guest_id
    requests.forEach(request => {
      const key = request.guest_id || '';
      if (!groupedRequests[key]) {
        groupedRequests[key] = [];
      }
      groupedRequests[key].push(request);
    });
    
    // Convert each group to a chat
    return Object.entries(groupedRequests).map(([userId, userRequests]) => {
      const latestRequest = userRequests[0];
      
      // Create messages from requests with the correct sender type
      const messages = userRequests.map(request => ({
        id: request.id,
        text: `${request.type} request: ${request.description || 'No description'}`,
        time: new Date(request.created_at).toLocaleString(),
        sender: 'user' as const,  // Explicitly type as 'user'
        status: 'sent' as const,  // Explicitly type as 'sent'
        type: 'request' as const, // Explicitly type as 'request'
        requestType: request.type,
        requestStatus: request.status
      }));
      
      return {
        id: userId,
        userId: latestRequest.guest_id || '',
        userName: latestRequest.guest_name || 'Guest',
        roomNumber: latestRequest.room_number || '',
        lastActivity: new Date(latestRequest.created_at).toISOString(),
        messages,
        unread: messages.length,
        type: 'request' as const  // Explicitly type as 'request'
      };
    });
  };
  
  // Combine regular chats with service request chats
  const allChats = [...chats, ...serviceRequestChats];
  
  const {
    activeChat,
    chatToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    setActiveChat,
    handleSelectChat,
    handleDeleteChat,
    confirmDelete,
    sendReply
  } = useChatOperations({ chats: allChats, setChats });

  const getFilteredChats = (tab: string) => {
    if (tab === 'all') return allChats;
    if (tab === 'unread') return allChats.filter(chat => chat.unread > 0);
    if (tab === 'requests') return allChats.filter(chat => chat.type === 'request');
    if (tab === 'messages') return allChats.filter(chat => chat.type !== 'request');
    return allChats;
  };

  return {
    chats: allChats,
    activeChat,
    loading,
    chatToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    setActiveChat,
    handleSelectChat,
    handleDeleteChat,
    confirmDelete,
    sendReply,
    getFilteredChats,
    fetchChats,
    currentTab,
    setCurrentTab
  };
}
