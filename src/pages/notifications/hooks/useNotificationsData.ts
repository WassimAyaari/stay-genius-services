
import { useEffect } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useTableReservations } from '@/hooks/useTableReservations';
import type { NotificationItem } from '../types/notificationTypes';
import { useRealtimeNotifications } from './useRealtimeNotifications';
import { useUserAuthentication } from './useUserAuthentication';
import { combineAndSortNotifications } from '../utils/notificationTransformers';

// Use 'export type' for re-exporting types when isolatedModules is enabled
export type { NotificationItem } from '../types/notificationTypes';

export const useNotificationsData = () => {
  // Get user authentication data
  const { userId, userEmail, userRoomNumber, isAuthenticated } = useUserAuthentication();
  
  // Get service requests and reservations
  const { 
    data: serviceRequests = [], 
    isLoading: isLoadingRequests, 
    refetch: refetchRequests 
  } = useServiceRequests();
  
  const { 
    reservations = [], 
    isLoading: isLoadingReservations, 
    refetch: refetchReservations 
  } = useTableReservations();

  // Force refetch on mount to ensure we have the latest data
  useEffect(() => {
    console.log("useNotificationsData - Refetching data on mount");
    console.log("Current room number:", userRoomNumber);
    refetchRequests();
    refetchReservations();
  }, [refetchRequests, refetchReservations, userRoomNumber]);

  // Set up real-time listeners
  useRealtimeNotifications(
    userId, 
    userEmail, 
    userRoomNumber, 
    refetchRequests, 
    refetchReservations
  );

  // Combine and sort notifications
  const notifications: NotificationItem[] = combineAndSortNotifications(
    serviceRequests, 
    reservations
  );

  const isLoading = isLoadingRequests || isLoadingReservations;

  return {
    notifications,
    isLoading,
    isAuthenticated,
    userId,
    userEmail,
    userRoomNumber
  };
};
