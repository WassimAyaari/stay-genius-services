
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
    link: `/my-room/request/${request.id}`
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
    link: `/dining/reservation/${reservation.id}`
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
  reservations: any[] = []
): NotificationItem[] => {
  // Transform the different types of notifications
  const requestNotifications = transformServiceRequests(serviceRequests);
  const reservationNotifications = transformTableReservations(reservations);
  
  // Combine all notifications
  const allNotifications = [
    ...requestNotifications,
    ...reservationNotifications
  ];
  
  // Sort by date, newest first
  return allNotifications.sort((a, b) => {
    const timeA = a.time instanceof Date ? a.time.getTime() : 0;
    const timeB = b.time instanceof Date ? b.time.getTime() : 0;
    return timeB - timeA;
  });
};
