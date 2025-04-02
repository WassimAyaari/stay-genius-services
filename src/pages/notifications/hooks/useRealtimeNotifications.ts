
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
  refetchCallback?: () => void
) => {
  // Real-time listeners for notifications
  useEffect(() => {
    if (!userId && !userEmail && !userRoomNumber) {
      console.log("No user ID, email or room number found, not setting up real-time listeners");
      return;
    }
    
    console.log("Setting up real-time listeners with user ID:", userId, "email:", userEmail, "and room number:", userRoomNumber);
    
    // Create a refetch function
    const handleRefetch = () => {
      if (refetchCallback) {
        refetchCallback();
      } else {
        console.log("Notification update received. No refetch callback provided.");
      }
    };
    
    const channels = [];

    // Table reservations listeners
    if (userId) {
      channels.push(setupReservationListenerById(userId, handleRefetch));
    }
    
    if (userEmail) {
      channels.push(setupReservationListenerByEmail(userEmail, handleRefetch));
    }
    
    // Service requests listeners
    if (userId) {
      channels.push(setupServiceRequestListenerById(userId, handleRefetch));
    }

    if (userRoomNumber) {
      channels.push(setupServiceRequestListenerByRoom(userRoomNumber, handleRefetch));
    }
    
    // Spa bookings listeners
    if (userId) {
      channels.push(setupSpaBookingListenerById(userId, handleRefetch));
    }
    
    if (userRoomNumber) {
      channels.push(setupSpaBookingListenerByRoom(userRoomNumber, handleRefetch));
    }
    
    return () => {
      console.log("Cleaning up real-time listeners for notifications page");
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [userId, userEmail, userRoomNumber, refetchCallback]);
};
