
import { useEffect, useState } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useTableReservations } from '@/hooks/useTableReservations';
import { useSpaBookings } from '@/hooks/useSpaBookings';
import { NotificationItem, SpaBooking } from '../types/notificationTypes';
import { useUserAuthentication } from './useUserAuthentication';
import { combineAndSortNotifications } from '../utils/notificationTransformers';

export const useNotificationsData = () => {
  // Get user authentication data
  const { userId, userEmail, userRoomNumber, isAuthenticated } = useUserAuthentication();
  
  // Get service requests
  const { 
    data: serviceRequests = [], 
    isLoading: isLoadingRequests,
    isError: isServiceRequestsError
  } = useServiceRequests();
  
  // Get table reservations
  const { 
    reservations = [], 
    isLoading: isLoadingReservations,
    error: reservationsError
  } = useTableReservations();
  
  // Get spa bookings
  const { 
    bookings: spaBookings = [], 
    isLoading: isLoadingSpaBookings,
    error: spaBookingsError,
    fetchUserBookings
  } = useSpaBookings();
  
  // State for notifications and errors
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [userSpaBookings, setUserSpaBookings] = useState<SpaBooking[]>([]);
  const [combinedError, setCombinedError] = useState<boolean>(false);
  
  // Fetch user spa bookings when userId is available
  useEffect(() => {
    const loadUserSpaBookings = async () => {
      if (!userId && !userEmail) return;
      
      try {
        if (userId) {
          const bookings = await fetchUserBookings(userId);
          setUserSpaBookings(bookings || []);
        }
      } catch (error) {
        console.error("Error fetching user spa bookings:", error);
      }
    };
    
    loadUserSpaBookings();
  }, [userId, userEmail, fetchUserBookings]);

  // Debug logs
  useEffect(() => {
    console.log("Data sources:", {
      serviceRequests: serviceRequests?.length || 0,
      reservations: reservations?.length || 0,
      spaBookings: userSpaBookings?.length || 0,
      isLoadingRequests,
      isLoadingReservations,
      isLoadingSpaBookings,
      hasServiceRequestError: isServiceRequestsError,
      hasReservationError: !!reservationsError,
      hasSpaBookingError: !!spaBookingsError
    });
  }, [serviceRequests, reservations, userSpaBookings, isLoadingRequests, 
      isLoadingReservations, isLoadingSpaBookings, isServiceRequestsError, 
      reservationsError, spaBookingsError]);

  // Create notifications when data changes
  useEffect(() => {
    try {
      // Ensure we have arrays for all data sources
      const safeServiceRequests = Array.isArray(serviceRequests) ? serviceRequests : [];
      const safeReservations = Array.isArray(reservations) ? reservations : [];
      const safeSpaBookings = Array.isArray(userSpaBookings) ? userSpaBookings : [];
      
      // Combine and sort notifications
      const combinedNotifications = combineAndSortNotifications(
        safeServiceRequests, 
        safeReservations,
        safeSpaBookings
      );
      
      setNotifications(combinedNotifications);
      setCombinedError(false);
      
      console.log("Combined notifications:", combinedNotifications.length);
    } catch (error) {
      console.error("Error combining notifications:", error);
      setNotifications([]);
      setCombinedError(true);
    }
  }, [serviceRequests, reservations, userSpaBookings]);

  const isLoading = isLoadingRequests || isLoadingReservations || isLoadingSpaBookings;
  const error = isServiceRequestsError || reservationsError || spaBookingsError || combinedError;

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
