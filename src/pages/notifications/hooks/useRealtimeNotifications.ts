
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
  userRoomNumber: string | null | undefined
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
      channels.push(setupReservationListenerById(userId));
    }
    
    if (userEmail) {
      channels.push(setupReservationListenerByEmail(userEmail));
    }
    
    // Service requests listeners
    if (userId) {
      channels.push(setupServiceRequestListenerById(userId));
    }

    if (userRoomNumber) {
      channels.push(setupServiceRequestListenerByRoom(userRoomNumber));
    }
    
    // Spa bookings listeners
    if (userId) {
      channels.push(setupSpaBookingListenerById(userId));
    }
    
    if (userRoomNumber) {
      channels.push(setupSpaBookingListenerByRoom(userRoomNumber));
    }
    
    return () => {
      console.log("Cleaning up real-time listeners for notifications page");
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [userId, userEmail, userRoomNumber]);
};
