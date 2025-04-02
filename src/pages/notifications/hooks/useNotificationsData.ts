
import { useEffect, useState } from 'react';
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
          // Convert imported SpaBooking type to the local NotificationTypes SpaBooking type
          const typedBookings: SpaBooking[] = bookings.map(booking => ({
            ...booking,
            // Ensure required fields are present
            created_at: booking.created_at || new Date().toISOString(),
          }));
          setUserSpaBookings(typedBookings);
        } catch (error) {
          console.error("Error fetching user spa bookings:", error);
          setUserSpaBookings([]);
        } finally {
          setIsLoadingUserBookings(false);
        }
      } else if (userRoomNumber) {
        // If no user ID but has room number, filter bookings by room number
        const filteredBookings = allBookings.filter(booking => booking.room_number === userRoomNumber);
        // Convert to the right type
        const typedBookings: SpaBooking[] = filteredBookings.map(booking => ({
          ...booking,
          // Ensure required fields are present
          created_at: booking.created_at || new Date().toISOString(),
        }));
        setUserSpaBookings(typedBookings);
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

  // Convert reservations to the expected TableReservation type
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
    created_at: res.createdAt,
    updated_at: res.updatedAt || res.createdAt
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
    userRoomNumber
  };
};
