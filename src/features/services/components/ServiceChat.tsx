
import React, { useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useChatMessages } from './chat/useChatMessages';
import ChatHeader from './chat/ChatHeader';
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';
import { useRealtimeMessages } from '@/hooks/messaging/useRealtimeMessages';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ServiceChatProps {
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
  userInfo: { name: string; roomNumber: string };
}

const ServiceChat = ({ isChatOpen, setIsChatOpen, userInfo }: ServiceChatProps) => {
  const {
    inputMessage,
    setInputMessage,
    messages,
    messagesEndRef,
    handleSendMessage,
    handleMessageSubmit,
    fetchMessages,
  } = useChatMessages(userInfo);

  // Setup realtime message updates
  useRealtimeMessages({ fetchMessages });
  
  // Listen for service request updates
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;
    
    // Channel for service request updates
    const serviceChannel = supabase
      .channel('service_request_updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'service_requests',
        filter: `guest_id=eq.${userId}`,
      }, (payload) => {
        console.log('Service request updated:', payload);
        
        // Show a toast notification for the service update
        const statusMap: Record<string, string> = {
          'pending': 'est en attente',
          'in_progress': 'est en cours de traitement',
          'completed': 'a été complétée',
          'cancelled': 'a été annulée'
        };
        
        const status = payload.new.status;
        const message = statusMap[status] || 'a été mise à jour';
        
        toast.info(`Mise à jour de demande`, {
          description: `Votre demande de type ${payload.new.type} ${message}.`
        });
        
        // Refresh messages to show updated request status
        fetchMessages();
      })
      .subscribe();
      
    // Channel for reservation updates
    const reservationChannel = supabase
      .channel('reservation_updates_chat')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'table_reservations',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        console.log('Reservation updated:', payload);
        
        if (payload.old.status === payload.new.status) return;
        
        // Show a toast notification for the reservation update
        const statusMap: Record<string, string> = {
          'pending': 'est en attente',
          'confirmed': 'a été confirmée',
          'cancelled': 'a été annulée'
        };
        
        const status = payload.new.status;
        const message = statusMap[status] || 'a été mise à jour';
        
        const date = new Date(payload.new.date).toLocaleDateString('fr-FR');
        const time = payload.new.time;
        
        toast.info(`Mise à jour de réservation`, {
          description: `Votre réservation de table pour le ${date} à ${time} ${message}.`
        });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(serviceChannel);
      supabase.removeChannel(reservationChannel);
    };
  }, [fetchMessages]);

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
      <SheetContent className="sm:max-w-md p-0 flex flex-col h-full">
        <ChatHeader userInfo={userInfo} onClose={handleCloseChat} />
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
        <MessageInput 
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          handleMessageSubmit={handleMessageSubmit}
        />
      </SheetContent>
    </Sheet>
  );
};

export default ServiceChat;
