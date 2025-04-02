
import { useEffect, useState } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useTableReservations } from '@/hooks/useTableReservations';
import { useSpaBookings } from '@/hooks/useSpaBookings';
import { useSpaServices } from '@/hooks/useSpaServices';
import { NotificationItem, SpaBooking } from '../types/notificationTypes';
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

  // Get spa bookings
  const {
    bookings: allBookings = [],
    isLoading: isLoadingSpaBookings,
    fetchUserBookings
  } = useSpaBookings();

  const { services = [] } = useSpaServices();

  // State for user's spa bookings
  const [userSpaBookings, setUserSpaBookings] = useState<SpaBooking[]>([]);
  const [isLoadingUserBookings, setIsLoadingUserBookings] = useState(false);

  // Create a mapping of service IDs to service names
  const serviceNamesMap = services.reduce((acc, service) => {
    acc[service.id] = service.name;
    return acc;
  }, {} as Record<string, string>);

  // Fetch user's spa bookings when user ID changes
  useEffect(() => {
    const loadUserBookings = async () => {
      if (userId) {
        setIsLoadingUserBookings(true);
        try {
          const bookings = await fetchUserBookings(userId);
          setUserSpaBookings(bookings);
        } catch (error) {
          console.error("Error fetching user spa bookings:", error);
          setUserSpaBookings([]);
        } finally {
          setIsLoadingUserBookings(false);
        }
      } else if (userRoomNumber) {
        // If no user ID but has room number, filter bookings by room number
        setUserSpaBookings(allBookings.filter(booking => booking.room_number === userRoomNumber));
      } else {
        setUserSpaBookings([]);
      }
    };
    
    loadUserBookings();
  }, [userId, userRoomNumber, fetchUserBookings, allBookings]);

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
    reservations,
    userSpaBookings,
    serviceNamesMap
  );

  const isLoading = isLoadingRequests || isLoadingReservations || isLoadingSpaBookings || isLoadingUserBookings;

  return {
    notifications,
    isLoading,
    isAuthenticated,
    userId,
    userEmail,
    userRoomNumber
  };
};
