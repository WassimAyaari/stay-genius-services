
import { ServiceRequest } from '@/features/concierge/types';
import { TableReservation } from '@/features/dining/types';
import { SpaBooking } from '@/types/spa';
import { EventReservation } from '@/types/event';
import { NotificationItem } from '@/types/notification';

// Combine notifications from multiple sources and sort them by date
export const combineAndSortNotifications = (
  serviceRequests: ServiceRequest[],
  tableReservations: TableReservation[],
  spaBookings: SpaBooking[],
  eventReservations: EventReservation[] = []
): NotificationItem[] => {
  const notifications: NotificationItem[] = [];

  // Map service requests to notification items
  serviceRequests.forEach(request => {
    notifications.push({
      id: request.id,
      type: 'request',
      title: `Demande de service ${request.type}`,
      description: request.description || 'Demande de service',
      icon: 'tool',
      status: request.status,
      time: new Date(request.created_at),
      link: `/requests/${request.id}`,
      data: {
        service_type: request.type,
        description: request.description,
        room_number: request.room_number
      }
    });
  });

  // Map table reservations to notification items
  tableReservations.forEach(reservation => {
    notifications.push({
      id: reservation.id,
      type: 'reservation',
      title: `Réservation de table`,
      description: `Réservation pour ${reservation.guests} personne(s)`,
      icon: 'utensils',
      status: reservation.status,
      time: new Date(reservation.createdAt),
      link: `/dining/reservations/${reservation.id}`,
      data: {
        restaurant_id: reservation.restaurantId,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        room_number: reservation.roomNumber,
        special_requests: reservation.specialRequests
      }
    });
  });

  // Map spa bookings to notification items
  spaBookings.forEach(booking => {
    notifications.push({
      id: booking.id,
      type: 'spa_booking',
      title: `Réservation spa`,
      description: `Réservation pour le ${booking.date}`,
      icon: 'spa',
      status: booking.status,
      time: new Date(booking.created_at),
      link: `/spa/booking/${booking.id}`,
      data: {
        service_id: booking.service_id,
        date: booking.date,
        time: booking.time,
        room_number: booking.room_number,
        special_requests: booking.special_requests
      }
    });
  });

  // Map event reservations to notification items
  eventReservations.forEach(reservation => {
    notifications.push({
      id: reservation.id,
      type: 'event_reservation',
      title: `Réservation d'événement`,
      description: `Réservation pour ${reservation.guests} personne(s)`,
      icon: 'calendar',
      status: reservation.status,
      time: new Date(reservation.createdAt),
      link: `/events/reservation/${reservation.id}`,
      data: {
        event_id: reservation.eventId,
        date: reservation.date,
        guests: reservation.guests,
        room_number: reservation.roomNumber,
        special_requests: reservation.specialRequests
      }
    });
  });

  // Sort notifications by date, newest first
  return notifications.sort((a, b) => b.time.getTime() - a.time.getTime());
};
