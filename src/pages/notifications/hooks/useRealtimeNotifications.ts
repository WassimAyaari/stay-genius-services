
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Sets up real-time listeners for notifications
 */
export const useRealtimeNotifications = (
  userId: string | null | undefined,
  userEmail: string | null | undefined,
  userRoomNumber: string | null | undefined,
  refetchRequests: () => void,
  refetchReservations: () => void,
  refetchSpaBookings: () => void
) => {
  // Real-time listeners for notifications
  useEffect(() => {
    if (!userId && !userEmail && !userRoomNumber) {
      console.log("No user ID, email or room number found, not setting up real-time listeners");
      return;
    }
    
    console.log("Setting up real-time listeners with user ID:", userId, "email:", userEmail, "and room number:", userRoomNumber);
    
    const channels = [];

    // Table reservations listeners
    if (userId) {
      channels.push(setupReservationListenerById(userId, refetchReservations));
    }
    
    if (userEmail) {
      channels.push(setupReservationListenerByEmail(userEmail, refetchReservations));
    }
    
    // Service requests listeners
    if (userId) {
      channels.push(setupServiceRequestListenerById(userId, refetchRequests));
    }

    if (userRoomNumber) {
      channels.push(setupServiceRequestListenerByRoom(userRoomNumber, refetchRequests));
    }
    
    // Spa bookings listeners
    if (userId) {
      channels.push(setupSpaBookingListenerById(userId, refetchSpaBookings));
    }
    
    if (userRoomNumber) {
      channels.push(setupSpaBookingListenerByRoom(userRoomNumber, refetchSpaBookings));
    }
    
    return () => {
      console.log("Cleaning up real-time listeners for notifications page");
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [userId, userEmail, userRoomNumber, refetchReservations, refetchRequests, refetchSpaBookings]);
};

/**
 * Setup listener for table reservation updates by user ID
 */
const setupReservationListenerById = (userId: string, refetchReservations: () => void) => {
  return supabase
    .channel('notifications_page_reservation_updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'table_reservations',
      filter: `user_id=eq.${userId}`,
    }, (payload) => {
      console.log('Notification page - reservation update received by ID:', payload);
      handleReservationUpdate(payload, refetchReservations);
    })
    .subscribe();
};

/**
 * Setup listener for table reservation updates by email
 */
const setupReservationListenerByEmail = (userEmail: string, refetchReservations: () => void) => {
  return supabase
    .channel('notifications_page_email_updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'table_reservations',
      filter: `guest_email=eq.${userEmail}`,
    }, (payload) => {
      console.log('Notification page - reservation email update received:', payload);
      handleReservationUpdate(payload, refetchReservations);
    })
    .subscribe();
};

/**
 * Handle reservation update events
 */
const handleReservationUpdate = (payload: any, refetchReservations: () => void) => {
  // Show notification for status changes
  if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
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
  }
  
  refetchReservations();
};

/**
 * Setup listener for service request updates by user ID
 */
const setupServiceRequestListenerById = (userId: string, refetchRequests: () => void) => {
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
 * Setup listener for service request updates by room number
 */
const setupServiceRequestListenerByRoom = (roomNumber: string, refetchRequests: () => void) => {
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
const handleServiceRequestUpdate = (payload: any, refetchRequests: () => void) => {
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

/**
 * Setup listener for spa booking updates by user ID
 */
const setupSpaBookingListenerById = (userId: string, refetchSpaBookings: () => void) => {
  return supabase
    .channel('notifications_page_spa_updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'spa_bookings',
      filter: `user_id=eq.${userId}`,
    }, (payload) => {
      console.log('Notification page - spa booking update received by user ID:', payload);
      handleSpaBookingUpdate(payload, refetchSpaBookings);
    })
    .subscribe();
};

/**
 * Setup listener for spa booking updates by room number
 */
const setupSpaBookingListenerByRoom = (roomNumber: string, refetchSpaBookings: () => void) => {
  return supabase
    .channel('notifications_page_room_spa_updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'spa_bookings',
      filter: `room_number=eq.${roomNumber}`,
    }, (payload) => {
      console.log('Notification page - spa update received by room number:', payload);
      handleSpaBookingUpdate(payload, refetchSpaBookings);
    })
    .subscribe();
};

/**
 * Handle spa booking update events
 */
const handleSpaBookingUpdate = (payload: any, refetchSpaBookings: () => void) => {
  // Show notification for status changes
  if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
    const statusMap: Record<string, string> = {
      'pending': 'est en attente',
      'confirmed': 'a été confirmée',
      'cancelled': 'a été annulée',
      'completed': 'a été complétée'
    };
    
    const status = payload.new.status;
    const message = statusMap[status] || 'a été mise à jour';
    
    const date = new Date(payload.new.date).toLocaleDateString('fr-FR');
    
    toast.info(`Mise à jour de réservation spa`, {
      description: `Votre réservation spa pour le ${date} à ${payload.new.time} ${message}.`
    });
  }
  
  refetchSpaBookings();
};
