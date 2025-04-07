
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Hook to set up realtime listeners for notifications
 */
export const useNotificationsRealtime = (
  userId: string | null | undefined,
  userEmail: string | null | undefined,
  userRoomNumber: string | null | undefined,
  refetchReservations: () => void,
  refetchServices: () => void,
  refetchSpaBookings: () => void,
  refetchEventReservations: () => void,
  setHasNewNotifications: (value: boolean) => void
) => {
  // Set up real-time listeners for notifications
  useEffect(() => {
    if (!userId && !userEmail && !userRoomNumber) {
      console.log("No user ID, email or room number found, not setting up real-time listeners in useNotifications");
      return;
    }
    
    console.log("useNotifications - Setting up real-time listeners with user ID:", userId, "email:", userEmail, "and room number:", userRoomNumber);
    
    const channels = [];
    
    // Listen for reservation updates by user ID or email
    if (userId) {
      const reservationChannel = setupReservationListenerById(userId, refetchReservations, setHasNewNotifications);
      channels.push(reservationChannel);
    }
    
    if (userEmail) {
      const emailChannel = setupReservationListenerByEmail(userEmail, refetchReservations, setHasNewNotifications);
      channels.push(emailChannel);
    }
    
    // Listen for service request updates
    if (userId) {
      const serviceChannel = setupServiceRequestListener(userId, refetchServices, setHasNewNotifications);
      channels.push(serviceChannel);
    }
    
    // Listen for spa booking updates by user ID or room number
    if (userId) {
      const spaUserChannel = setupSpaBookingListenerById(userId, refetchSpaBookings, setHasNewNotifications);
      channels.push(spaUserChannel);
    }
    
    if (userRoomNumber) {
      const spaRoomChannel = setupSpaBookingListenerByRoom(userRoomNumber, refetchSpaBookings, setHasNewNotifications);
      channels.push(spaRoomChannel);
    }

    // Listen for event reservation updates by user ID or email
    if (userId) {
      const eventUserChannel = setupEventReservationListenerById(userId, refetchEventReservations, setHasNewNotifications);
      channels.push(eventUserChannel);
    }
    
    if (userEmail) {
      const eventEmailChannel = setupEventReservationListenerByEmail(userEmail, refetchEventReservations, setHasNewNotifications);
      channels.push(eventEmailChannel);
    }
    
    return () => {
      console.log("Cleaning up real-time listeners for notifications");
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [userId, userEmail, userRoomNumber, refetchReservations, refetchServices, refetchSpaBookings, refetchEventReservations, setHasNewNotifications]);
};

/**
 * Set up listener for reservation updates by user ID
 */
const setupReservationListenerById = (
  userId: string,
  refetchReservations: () => void,
  setHasNewNotifications: (value: boolean) => void
) => {
  return supabase
    .channel('notification_reservation_updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'table_reservations',
      filter: `user_id=eq.${userId}`,
    }, (payload) => {
      console.log('Notification reservation update received by ID:', payload);
      setHasNewNotifications(true);
      refetchReservations();
      
      // Show toast for status updates
      handleReservationStatusChange(payload);
    })
    .subscribe();
};

/**
 * Set up listener for reservation updates by email
 */
const setupReservationListenerByEmail = (
  userEmail: string,
  refetchReservations: () => void,
  setHasNewNotifications: (value: boolean) => void
) => {
  return supabase
    .channel('notification_reservation_email_updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'table_reservations',
      filter: `guest_email=eq.${userEmail}`,
    }, (payload) => {
      console.log('Notification reservation email update received:', payload);
      setHasNewNotifications(true);
      refetchReservations();
      
      // Show toast for status updates
      handleReservationStatusChange(payload);
    })
    .subscribe();
};

/**
 * Set up listener for service request updates
 */
const setupServiceRequestListener = (
  userId: string,
  refetchServices: () => void,
  setHasNewNotifications: (value: boolean) => void
) => {
  return supabase
    .channel('notification_service_updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'service_requests',
      filter: `guest_id=eq.${userId}`,
    }, (payload) => {
      console.log('Notification service update received:', payload);
      setHasNewNotifications(true);
      refetchServices();
      
      // Show toast for status updates
      handleServiceStatusChange(payload);
    })
    .subscribe();
};

/**
 * Set up listener for spa booking updates by user ID
 */
const setupSpaBookingListenerById = (
  userId: string,
  refetchSpaBookings: () => void,
  setHasNewNotifications: (value: boolean) => void
) => {
  return supabase
    .channel('notification_spa_user_updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'spa_bookings',
      filter: `user_id=eq.${userId}`,
    }, (payload) => {
      console.log('Notification spa booking update received by user ID:', payload);
      setHasNewNotifications(true);
      refetchSpaBookings();
      
      // Show toast for status updates
      handleSpaBookingStatusChange(payload);
    })
    .subscribe();
};

/**
 * Set up listener for spa booking updates by room number
 */
const setupSpaBookingListenerByRoom = (
  roomNumber: string,
  refetchSpaBookings: () => void,
  setHasNewNotifications: (value: boolean) => void
) => {
  return supabase
    .channel('notification_spa_room_updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'spa_bookings',
      filter: `room_number=eq.${roomNumber}`,
    }, (payload) => {
      console.log('Notification spa booking update received by room number:', payload);
      setHasNewNotifications(true);
      refetchSpaBookings();
      
      // Show toast for status updates
      handleSpaBookingStatusChange(payload);
    })
    .subscribe();
};

/**
 * Set up listener for event reservation updates by user ID
 */
const setupEventReservationListenerById = (
  userId: string,
  refetchEventReservations: () => void,
  setHasNewNotifications: (value: boolean) => void
) => {
  return supabase
    .channel('notification_event_user_updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'event_reservations',
      filter: `user_id=eq.${userId}`,
    }, (payload) => {
      console.log('Notification event reservation update received by user ID:', payload);
      setHasNewNotifications(true);
      refetchEventReservations();
      
      // Show toast for status updates
      handleEventReservationStatusChange(payload);
    })
    .subscribe();
};

/**
 * Set up listener for event reservation updates by email
 */
const setupEventReservationListenerByEmail = (
  userEmail: string,
  refetchEventReservations: () => void,
  setHasNewNotifications: (value: boolean) => void
) => {
  return supabase
    .channel('notification_event_email_updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'event_reservations',
      filter: `guest_email=eq.${userEmail}`,
    }, (payload) => {
      console.log('Notification event reservation email update received:', payload);
      setHasNewNotifications(true);
      refetchEventReservations();
      
      // Show toast for status updates
      handleEventReservationStatusChange(payload);
    })
    .subscribe();
};

/**
 * Handle reservation status change toasts
 */
const handleReservationStatusChange = (payload: any) => {
  if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
    const statusMap: Record<string, string> = {
      'pending': 'est en attente',
      'confirmed': 'a été confirmée',
      'cancelled': 'a été annulée'
    };
    
    const status = payload.new.status;
    const message = statusMap[status] || 'a été mise à jour';
    
    toast.info(`Mise à jour de réservation`, {
      description: `Votre réservation de table ${message}.`
    });
  }
};

/**
 * Handle service request status change toasts
 */
const handleServiceStatusChange = (payload: any) => {
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
      description: `Votre demande de service ${message}.`
    });
  }
};

/**
 * Handle spa booking status change toasts
 */
const handleSpaBookingStatusChange = (payload: any) => {
  if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
    const statusMap: Record<string, string> = {
      'pending': 'est en attente',
      'confirmed': 'a été confirmée',
      'cancelled': 'a été annulée',
      'completed': 'a été complétée'
    };
    
    const status = payload.new.status;
    const message = statusMap[status] || 'a été mise à jour';
    
    toast.info(`Mise à jour de réservation spa`, {
      description: `Votre réservation de spa ${message}.`
    });
  }
};

/**
 * Handle event reservation status change toasts
 */
const handleEventReservationStatusChange = (payload: any) => {
  if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
    const statusMap: Record<string, string> = {
      'pending': 'est en attente',
      'confirmed': 'a été confirmée',
      'cancelled': 'a été annulée'
    };
    
    const status = payload.new.status;
    const message = statusMap[status] || 'a été mise à jour';
    
    toast.info(`Mise à jour de réservation d'événement`, {
      description: `Votre réservation d'événement ${message}.`
    });
  }
};
