
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  setupReservationListenerById, 
  setupReservationListenerByEmail 
} from './listeners/useTableReservationListeners';
import { 
  setupServiceRequestListenerById, 
  setupServiceRequestListenerByRoom 
} from './listeners/useServiceRequestListeners';
import { 
  setupSpaBookingListenerById, 
  setupSpaBookingListenerByRoom 
} from './listeners/useSpaBookingListeners';

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
