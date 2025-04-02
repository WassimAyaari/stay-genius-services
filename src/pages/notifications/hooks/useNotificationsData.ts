
import { useEffect, useState, useCallback } from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useTableReservations } from '@/hooks/useTableReservations';
import { useSpaBookings } from '@/hooks/useSpaBookings';
import { useSpaServices } from '@/hooks/useSpaServices';
import { NotificationItem, SpaBooking, ServiceRequest, TableReservation } from '../types/notificationTypes';
import { useRealtimeNotifications } from './useRealtimeNotifications';
import { useUserAuthentication } from './useUserAuthentication';
import { combineAndSortNotifications } from '../utils/notificationTransformers';

// Use 'export type' for re-exporting types when isolatedModules is enabled
export type { NotificationItem } from '../types/notificationTypes';

// Helper function to ensure a SpaBooking has created_at
const ensureCreatedAt = (booking: SpaBooking): SpaBooking => {
  return {
    ...booking,
    created_at: booking.created_at || new Date().toISOString(),
  };
};

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
    fetchUserBookings,
    refetch: refetchSpaBookings
  } = useSpaBookings();

  const { services = [] } = useSpaServices();

  // State for user's spa bookings
  const [userSpaBookings, setUserSpaBookings] = useState<SpaBooking[]>([]);
  const [isLoadingUserBookings, setIsLoadingUserBookings] = useState(false);
  // Add state to prevent refetching on every render
  const [hasInitiallyFetched, setHasInitiallyFetched] = useState(false);

  // Create a mapping of service IDs to service names
  const serviceNamesMap = services.reduce((acc, service) => {
    acc[service.id] = service.name;
    return acc;
  }, {} as Record<string, string>);

  // Memoized function to load user bookings
  const loadUserBookings = useCallback(async () => {
    if (userId) {
      setIsLoadingUserBookings(true);
      try {
        const bookings = await fetchUserBookings(userId);
        
        // Ensure each booking has created_at field (using current date as fallback)
        const typedBookings: SpaBooking[] = bookings.map(ensureCreatedAt);
        setUserSpaBookings(typedBookings);
      } catch (error) {
        console.error("Error fetching user spa bookings:", error);
        setUserSpaBookings([]);
      } finally {
        setIsLoadingUserBookings(false);
      }
    } else if (userRoomNumber) {
      // If no user ID but has room number, filter bookings by room number
      const filteredBookings = allBookings.filter(booking => 
        booking.room_number === userRoomNumber
      );
      
      // Ensure each booking has created_at field
      const typedBookings: SpaBooking[] = filteredBookings.map(ensureCreatedAt);
      setUserSpaBookings(typedBookings);
    } else {
      setUserSpaBookings([]);
    }
  }, [userId, userRoomNumber, fetchUserBookings, allBookings]);

  // Fetch user's spa bookings when user ID changes
  useEffect(() => {
    loadUserBookings();
  }, [loadUserBookings]);

  // Force refetch on mount to ensure we have the latest data, but ONLY ONCE
  useEffect(() => {
    if (!hasInitiallyFetched) {
      console.log("useNotificationsData - Initial data fetch");
      console.log("Current room number:", userRoomNumber);
      refetchRequests();
      refetchReservations();
      if (refetchSpaBookings) {
        refetchSpaBookings();
      }
      setHasInitiallyFetched(true);
    }
  }, [refetchRequests, refetchReservations, refetchSpaBookings, userRoomNumber, hasInitiallyFetched]);

  // Set up real-time listeners
  useRealtimeNotifications(
    userId, 
    userEmail, 
    userRoomNumber, 
    refetchRequests, 
    refetchReservations,
    refetchSpaBookings
  );

  // Convert reservations to the expected TableReservation type and ensure created_at
  const typedReservations: TableReservation[] = reservations.map(res => ({
    id: res.id,
    restaurant_id: res.restaurantId,
    date: res.date,
    time: res.time,
    guests: res.guests,
    guest_name: res.guestName || "",
    guest_email: res.guestEmail || "",
    guest_phone: res.guestPhone,
    room_number: res.roomNumber,
    special_requests: res.specialRequests,
    status: res.status,
    created_at: res.createdAt || new Date().toISOString(),
    updated_at: res.createdAt || new Date().toISOString() // Use createdAt as fallback for updated_at
  }));

  // Combine and sort notifications
  const notifications: NotificationItem[] = combineAndSortNotifications(
    serviceRequests as ServiceRequest[], 
    typedReservations,
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
    userRoomNumber,
    // Export the refetch functions so they can be used by the component
    refetchRequests,
    refetchReservations,
    refetchSpaBookings
  };
};
