
import { useEffect, useState } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useTableReservations } from '@/hooks/useTableReservations';
import { NotificationItem } from '../types/notificationTypes';
import { useUserAuthentication } from './useUserAuthentication';
import { combineAndSortNotifications } from '../utils/notificationTransformers';

export const useNotificationsData = () => {
  // Get user authentication data
  const { userId, userEmail, userRoomNumber, isAuthenticated } = useUserAuthentication();
  
  // Get service requests and reservations
  const { 
    data: serviceRequests = [], 
    isLoading: isLoadingRequests,
    isError: isServiceRequestsError
  } = useServiceRequests();
  
  const { 
    reservations = [], 
    isLoading: isLoadingReservations,
    error: reservationsError
  } = useTableReservations();

  // State for notifications and errors
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [combinedError, setCombinedError] = useState<boolean>(false);

  // Debug logs
  useEffect(() => {
    console.log("Data sources:", {
      serviceRequests: serviceRequests?.length || 0,
      reservations: reservations?.length || 0,
      isLoadingRequests,
      isLoadingReservations,
      hasServiceRequestError: isServiceRequestsError,
      hasReservationError: !!reservationsError
    });
  }, [serviceRequests, reservations, isLoadingRequests, isLoadingReservations, isServiceRequestsError, reservationsError]);

  // Create notifications when data changes
  useEffect(() => {
    try {
      // Ensure serviceRequests is an array
      const safeServiceRequests = Array.isArray(serviceRequests) ? serviceRequests : [];
      
      // Ensure reservations is an array
      const safeReservations = Array.isArray(reservations) ? reservations : [];
      
      // Combine and sort notifications
      const combinedNotifications = combineAndSortNotifications(
        safeServiceRequests, 
        safeReservations
      );
      
      setNotifications(combinedNotifications);
      setCombinedError(false);
      
      console.log("Combined notifications:", combinedNotifications.length);
    } catch (error) {
      console.error("Error combining notifications:", error);
      setNotifications([]);
      setCombinedError(true);
    }
  }, [serviceRequests, reservations]);

  const isLoading = isLoadingRequests || isLoadingReservations;
  const error = isServiceRequestsError || reservationsError || combinedError;

  return {
    notifications,
    isLoading,
    isAuthenticated,
    userId,
    userEmail,
    userRoomNumber,
    error: error ? true : false
  };
};
