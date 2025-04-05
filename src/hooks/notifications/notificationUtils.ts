
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { NotificationItem } from '@/types/notification';

// Safely create a Date object from a string
export const createSafeDate = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  return !isNaN(date.getTime()) ? date : null;
};

// Format time safely to avoid errors with invalid dates
export const formatTimeAgo = (date: Date | null | undefined): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'récemment';
  }
  
  try {
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  } catch (error) {
    console.error('Error formatting date:', error, date);
    return 'récemment';
  }
};

// Transform service requests to notifications
export const transformServiceRequests = (requests: any[]): NotificationItem[] => {
  if (!Array.isArray(requests)) return [];
  
  return requests.map(request => ({
    id: request.id || `req-${Math.random().toString(36).substr(2, 9)}`,
    type: 'request',
    title: `Demande: ${request.type || 'Service'}`,
    description: request.description || 'Service hôtelier',
    icon: getServiceIcon(request.type),
    status: request.status || 'pending',
    time: createSafeDate(request.created_at) || new Date(),
    link: `/requests/${request.id}`,
    data: {
      room_number: request.room_number,
      service_type: request.type,
      description: request.description
    }
  }));
};

// Transform reservations to notifications
export const transformTableReservations = (reservations: any[]): NotificationItem[] => {
  if (!Array.isArray(reservations)) return [];
  
  return reservations.map(reservation => ({
    id: reservation.id || `res-${Math.random().toString(36).substr(2, 9)}`,
    type: 'reservation',
    title: 'Réservation de restaurant',
    description: `${reservation.date} à ${reservation.time} - ${reservation.guests} personnes`,
    icon: '🍽️',
    status: reservation.status || 'pending',
    time: createSafeDate(reservation.createdAt || reservation.created_at) || new Date(),
    link: `/reservations/${reservation.id}`,
    data: {
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      restaurant_id: reservation.restaurant_id,
      room_number: reservation.room_number,
      special_requests: reservation.special_requests
    }
  }));
};

// Transform spa bookings to notifications
export const transformSpaBookings = (bookings: any[]): NotificationItem[] => {
  if (!Array.isArray(bookings)) return [];
  
  return bookings.map(booking => ({
    id: booking.id || `spa-${Math.random().toString(36).substr(2, 9)}`,
    type: 'spa_booking',
    title: 'Réservation de spa',
    description: `${booking.date} à ${booking.time}`,
    icon: '💆',
    status: booking.status || 'pending',
    time: createSafeDate(booking.created_at) || new Date(),
    link: `/spa/booking/${booking.id}`,
    data: {
      date: booking.date,
      time: booking.time,
      service_id: booking.service_id,
      room_number: booking.room_number,
      special_requests: booking.special_requests
    }
  }));
};

// Helper function to get an icon based on service type
function getServiceIcon(type: string): string {
  switch (type) {
    case 'housekeeping': return '🧹';
    case 'laundry': return '👕';
    case 'maintenance': return '🔧';
    case 'concierge': return '🔑';
    default: return '🔔';
  }
}

// Combine and sort all notifications
export const combineAndSortNotifications = (
  serviceRequests: any[] = [],
  reservations: any[] = [],
  spaBookings: any[] = []
): NotificationItem[] => {
  // Transform the different types of notifications
  const requestNotifications = transformServiceRequests(serviceRequests);
  const reservationNotifications = transformTableReservations(reservations);
  const spaNotifications = transformSpaBookings(spaBookings);
  
  // Combine all notifications
  const allNotifications = [
    ...requestNotifications,
    ...reservationNotifications,
    ...spaNotifications
  ];
  
  // Sort by date, newest first
  return allNotifications.sort((a, b) => {
    const timeA = a.time instanceof Date ? a.time.getTime() : 0;
    const timeB = b.time instanceof Date ? b.time.getTime() : 0;
    return timeB - timeA;
  });
};
