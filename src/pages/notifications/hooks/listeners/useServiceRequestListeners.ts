
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Set up listener for service request updates by user ID
 */
export const setupServiceRequestListenerById = (userId: string, refetchRequests: () => void) => {
  return supabase
    .channel('notifications_page_service_updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'service_requests',
      filter: `guest_id=eq.${userId}`,
    }, (payload) => {
      console.log('Notification page - service request update received by user ID:', payload);
      handleServiceRequestUpdate(payload, refetchRequests);
    })
    .subscribe();
};

/**
 * Set up listener for service request updates by room number
 */
export const setupServiceRequestListenerByRoom = (roomNumber: string, refetchRequests: () => void) => {
  return supabase
    .channel('notifications_page_room_service_updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'service_requests',
      filter: `room_number=eq.${roomNumber}`,
    }, (payload) => {
      console.log('Notification page - service request update received by room number:', payload);
      handleServiceRequestUpdate(payload, refetchRequests);
    })
    .subscribe();
};

/**
 * Handle service request update events
 */
export const handleServiceRequestUpdate = (payload: any, refetchRequests: () => void) => {
  // Show notification for status changes
  if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
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
  }
  
  refetchRequests();
};
