
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
    isError: isServiceRequestsError
  } = useServiceRequests();
  
  const { 
    reservations = [], 
    isLoading: isLoadingReservations,
    isError: isReservationsError
  } = useTableReservations();

  // Get spa bookings
  const {
    bookings: allBookings = [],
    isLoading: isLoadingSpaBookings,
    fetchUserBookings
  } = useSpaBookings();

  const { services = [] } = useSpaServices();

  // State for user's spa bookings and errors
  const [userSpaBookings, setUserSpaBookings] = useState<SpaBooking[]>([]);
  const [isLoadingUserBookings, setIsLoadingUserBookings] = useState(false);
  const [spaBookingsError, setSpaBookingsError] = useState<Error | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Create a mapping of service IDs to service names
  const serviceNamesMap = services.reduce((acc, service) => {
    acc[service.id] = service.name;
    return acc;
  }, {} as Record<string, string>);

  // Memoized function to load user bookings
  const loadUserBookings = useCallback(async () => {
    if (userId) {
      setIsLoadingUserBookings(true);
      setSpaBookingsError(null);
      try {
        const bookings = await fetchUserBookings(userId);
        
        // Ensure each booking has created_at field (using current date as fallback)
        const typedBookings: SpaBooking[] = bookings.map(ensureCreatedAt);
        setUserSpaBookings(typedBookings);
      } catch (error) {
        console.error("Error fetching user spa bookings:", error);
        setSpaBookingsError(error instanceof Error ? error : new Error("Failed to fetch spa bookings"));
        setUserSpaBookings([]);
      } finally {
        setIsLoadingUserBookings(false);
      }
    } else if (userRoomNumber) {
      // If no user ID but has room number, filter bookings by room number
      try {
        const filteredBookings = allBookings.filter(booking => 
          booking.room_number === userRoomNumber
        );
        
        // Ensure each booking has created_at field
        const typedBookings: SpaBooking[] = filteredBookings.map(ensureCreatedAt);
        setUserSpaBookings(typedBookings);
      } catch (error) {
        console.error("Error filtering spa bookings:", error);
        setSpaBookingsError(error instanceof Error ? error : new Error("Failed to filter spa bookings"));
        setUserSpaBookings([]);
      }
    } else {
      setUserSpaBookings([]);
    }
  }, [userId, userRoomNumber, fetchUserBookings, allBookings]);

  // Fetch user's spa bookings when user ID changes
  useEffect(() => {
    loadUserBookings();
  }, [loadUserBookings]);

  // Set up real-time listeners
  useRealtimeNotifications(
    userId, 
    userEmail, 
    userRoomNumber
  );

  // Create notifications when data changes
  useEffect(() => {
    try {
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
      const combinedNotifications = combineAndSortNotifications(
        serviceRequests as ServiceRequest[], 
        typedReservations,
        userSpaBookings,
        serviceNamesMap
      );
      
      setNotifications(combinedNotifications);
    } catch (error) {
      console.error("Error combining notifications:", error);
    }
  }, [serviceRequests, reservations, userSpaBookings, serviceNamesMap]);

  const isLoading = isLoadingRequests || isLoadingReservations || isLoadingSpaBookings || isLoadingUserBookings;
  const error = isServiceRequestsError || isReservationsError || spaBookingsError;

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
