import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Hook to set up realtime listeners for notifications with polling fallback
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
  const pollIntervalRef = useRef(5000); // Start at 5 seconds
  
  // Memoized refetch all function
  const refetchAll = useCallback(async () => {
    try {
      await Promise.all([
        refetchReservations(),
        refetchServices(),
        refetchSpaBookings(),
        refetchEventReservations()
      ]);
    } catch (error) {
      console.error('Notification polling error:', error);
    }
  }, [refetchReservations, refetchServices, refetchSpaBookings, refetchEventReservations]);

  // Polling fallback with exponential backoff
  useEffect(() => {
    if (!userId && !userEmail && !userRoomNumber) return;
    
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let isMounted = true;
    
    const poll = async () => {
      if (!isMounted) return;
      
      await refetchAll();
      
      // Gradually increase interval (max 30 seconds)
      pollIntervalRef.current = Math.min(pollIntervalRef.current * 1.5, 30000);
      
      if (isMounted) {
        timeoutId = setTimeout(poll, pollIntervalRef.current);
      }
    };
    
    // Start polling after initial delay
    timeoutId = setTimeout(poll, pollIntervalRef.current);
    
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [userId, userEmail, userRoomNumber, refetchAll]);

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
      'pending': 'is pending',
      'confirmed': 'has been confirmed',
      'cancelled': 'has been cancelled'
    };
    
    const status = payload.new.status;
    const message = statusMap[status] || 'has been updated';
    
    toast.info(`Reservation Update`, {
      description: `Your table reservation ${message}.`
    });
  }
};

/**
 * Handle service request status change toasts
 */
const handleServiceStatusChange = (payload: any) => {
  if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
    const statusMap: Record<string, string> = {
      'pending': 'is pending',
      'on_hold': 'is on hold',
      'in_progress': 'is in progress',
      'completed': 'has been completed',
      'cancelled': 'has been cancelled'
    };
    
    const status = payload.new.status;
    const message = statusMap[status] || 'has been updated';
    
    toast.info(`Service Request Update`, {
      description: `Your service request ${message}.`
    });
  }
};

/**
 * Handle spa booking status change toasts
 */
const handleSpaBookingStatusChange = (payload: any) => {
  if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
    const statusMap: Record<string, string> = {
      'pending': 'is pending',
      'confirmed': 'has been confirmed',
      'cancelled': 'has been cancelled',
      'completed': 'has been completed'
    };
    
    const status = payload.new.status;
    const message = statusMap[status] || 'has been updated';
    
    toast.info(`Spa Reservation Update`, {
      description: `Your spa reservation ${message}.`
    });
  }
};

/**
 * Handle event reservation status change toasts
 */
const handleEventReservationStatusChange = (payload: any) => {
  if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
    const statusMap: Record<string, string> = {
      'pending': 'is pending',
      'confirmed': 'has been confirmed',
      'cancelled': 'has been cancelled'
    };
    
    const status = payload.new.status;
    const message = statusMap[status] || 'has been updated';
    
    toast.info(`Event Reservation Update`, {
      description: `Your event reservation ${message}.`
    });
  }
};
