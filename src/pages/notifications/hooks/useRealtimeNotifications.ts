
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
    
    // Create a no-op function for refetch since we're removing auto-refresh
    const noopRefetch = () => {
      // Do nothing - we've removed auto-refresh
      console.log("Auto-refresh disabled in notifications");
    };
    
    const channels = [];

    // Table reservations listeners
    if (userId) {
      channels.push(setupReservationListenerById(userId, noopRefetch));
    }
    
    if (userEmail) {
      channels.push(setupReservationListenerByEmail(userEmail, noopRefetch));
    }
    
    // Service requests listeners
    if (userId) {
      channels.push(setupServiceRequestListenerById(userId, noopRefetch));
    }

    if (userRoomNumber) {
      channels.push(setupServiceRequestListenerByRoom(userRoomNumber, noopRefetch));
    }
    
    // Spa bookings listeners
    if (userId) {
      channels.push(setupSpaBookingListenerById(userId, noopRefetch));
    }
    
    if (userRoomNumber) {
      channels.push(setupSpaBookingListenerByRoom(userRoomNumber, noopRefetch));
    }
    
    return () => {
      console.log("Cleaning up real-time listeners for notifications page");
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [userId, userEmail, userRoomNumber]);
};
