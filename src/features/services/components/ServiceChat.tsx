import React, { useEffect } from 'react';
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
        
        if (payload.old.status === payload.new.status) return;
        
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
          'pending': 'est en attente de confirmation',
          'confirmed': 'a été confirmée',
          'cancelled': 'a été annulée'
        };
        
        const status = payload.new.status;
        const message = statusMap[status] || 'a été mise à jour';
        
        const date = new Date(payload.new.date).toLocaleDateString('fr-FR');
        const time = payload.new.time;
        
        toast.info(`Mise à jour de demande de réservation`, {
          description: `Votre demande de réservation de table pour le ${date} à ${time} ${message}.`
        });
      })
      .subscribe();
      
    // Channel for event reservation updates
    const eventReservationChannel = supabase
      .channel('event_reservation_updates_chat')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'event_reservations',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        console.log('Event reservation updated:', payload);
        
        if (payload.old.status === payload.new.status) return;
        
        // Show a toast notification for the event reservation update
        const statusMap: Record<string, string> = {
          'pending': 'est en attente de confirmation',
          'confirmed': 'a été confirmée',
          'cancelled': 'a été annulée'
        };
        
        const status = payload.new.status;
        const message = statusMap[status] || 'a été mise à jour';
        
        const date = new Date(payload.new.date).toLocaleDateString('fr-FR');
        
        toast.info(`Mise à jour de réservation d'événement`, {
          description: `Votre réservation d'événement pour le ${date} ${message}.`
        });
      })
      .subscribe();
      
    // Channel for reservation updates by email
    let emailReservationChannel;
    const userEmail = localStorage.getItem('user_email');
    if (userEmail) {
      emailReservationChannel = supabase
        .channel('reservation_email_updates_chat')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'table_reservations',
          filter: `guest_email=eq.${userEmail}`,
        }, (payload) => {
          console.log('Reservation updated by email:', payload);
          
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
    }
      
    return () => {
      supabase.removeChannel(serviceChannel);
      supabase.removeChannel(reservationChannel);
      supabase.removeChannel(eventReservationChannel);
      if (emailReservationChannel) {
        supabase.removeChannel(emailReservationChannel);
      }
    };
  }, [fetchMessages]);

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  if (!isChatOpen) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col h-screen">
      <ChatHeader userInfo={userInfo} onClose={handleCloseChat} />
      <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      <MessageInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
        handleMessageSubmit={handleMessageSubmit}
      />
    </div>
  );
};

export default ServiceChat;
