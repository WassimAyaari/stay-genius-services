
import { ServiceRequest } from '@/features/rooms/types';
import { TableReservation } from '@/features/dining/types';
import type { NotificationItem } from '../types/notificationTypes';

// Helper function to format date for display
const formatDate = (dateString: string): Date => {
  return new Date(dateString);
};

// Transform service requests into notification items
const transformServiceRequests = (requests: ServiceRequest[]): NotificationItem[] => {
  return requests.map(request => {
    const title = `Demande de service: ${request.type}`;
    let description = request.description || '';
    if (description.length > 60) {
      description = `${description.substring(0, 60)}...`;
    }

    return {
      id: request.id,
      type: 'request',
      title,
      description,
      status: request.status,
      time: formatDate(request.created_at),
      link: `/requests/${request.id}`,
      data: {
        type: request.type,
        room_number: request.room_number,
        status: request.status,
        guest_name: request.guest_name
      }
    };
  });
};

// Transform table reservations into notification items
const transformTableReservations = (reservations: TableReservation[]): NotificationItem[] => {
  return reservations.map(reservation => {
    const title = 'Réservation de table';
    const description = `Date: ${reservation.date}, Heure: ${reservation.time}`;

    return {
      id: reservation.id,
      type: 'reservation',
      title,
      description,
      status: reservation.status,
      time: formatDate(reservation.created_at),
      link: `/reservations/${reservation.id}`,
      data: {
        reservation_id: reservation.id,
        restaurant_id: reservation.restaurant_id,
        status: reservation.status,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        room_number: reservation.room_number
      }
    };
  });
};

// Transform spa bookings into notification items
const transformSpaBookings = (bookings: any[]): NotificationItem[] => {
  return bookings.map(booking => {
    const title = 'Réservation de spa';
    const description = `Date: ${booking.date}, Heure: ${booking.time}`;
    
    return {
      id: booking.id,
      type: 'spa_booking',
      title,
      description,
      status: booking.status,
      time: formatDate(booking.created_at),
      link: `/spa-bookings/${booking.id}`,
      data: {
        service_id: booking.service_id,
        facility_id: booking.facility_id,
        status: booking.status,
        date: booking.date,
        time: booking.time,
        room_number: booking.room_number,
        service_name: booking.spa_services?.name
      }
    };
  });
};

// Combine and sort all notifications
export const combineAndSortNotifications = (
  serviceRequests: ServiceRequest[],
  tableReservations: TableReservation[],
  spaBookings: any[] = []
): NotificationItem[] => {
  // Transform each type to the common notification format
  const requestNotifications = transformServiceRequests(serviceRequests);
  const reservationNotifications = transformTableReservations(tableReservations);
  const spaNotifications = transformSpaBookings(spaBookings);
  
  // Combine all notifications
  const allNotifications = [
    ...requestNotifications,
    ...reservationNotifications,
    ...spaNotifications
  ];
  
  // Sort by time, most recent first
  return allNotifications.sort((a, b) => b.time.getTime() - a.time.getTime());
};
