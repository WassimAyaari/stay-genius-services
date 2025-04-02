
import { 
  SpaBooking, 
  ServiceRequest, 
  TableReservation, 
  NotificationItem 
} from '../types/notificationTypes';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Transforme une liste de demandes de service en notifications
export const transformServiceRequests = (requests: ServiceRequest[]): NotificationItem[] => {
  return requests.map(request => ({
    id: request.id,
    type: 'request',
    title: `Demande de service: ${request.request_items?.name || request.type}`,
    description: request.description || 'Aucune description fournie',
    status: request.status,
    time: new Date(request.created_at),
    link: `/my-room/request/${request.id}`,
    data: {
      requestId: request.id,
      roomNumber: request.room_number,
      type: request.type,
      status: request.status,
      category: request.category_id,
    }
  }));
};

// Transforme une liste de réservations de restaurant en notifications
export const transformTableReservations = (reservations: TableReservation[]): NotificationItem[] => {
  return reservations.map(reservation => {
    const reservationDate = new Date(reservation.date);
    const formattedDate = format(reservationDate, 'EEEE d MMMM', { locale: fr });
    
    return {
      id: reservation.id,
      type: 'reservation',
      title: `Réservation de restaurant`,
      description: `${formattedDate} à ${reservation.time} - ${reservation.guests} ${reservation.guests > 1 ? 'personnes' : 'personne'}`,
      status: reservation.status,
      time: new Date(reservation.created_at),
      link: `/dining/reservation/${reservation.id}`,
      data: {
        restaurantId: reservation.restaurant_id,
        reservationId: reservation.id,
        status: reservation.status,
        date: reservation.date,
        time: reservation.time,
        roomNumber: reservation.room_number,
      }
    };
  });
};

// Transforme une liste de réservations de spa en notifications
export const transformSpaBookings = (bookings: SpaBooking[], services: Record<string, string>): NotificationItem[] => {
  return bookings.map(booking => {
    const bookingDate = new Date(booking.date);
    const formattedDate = format(bookingDate, 'EEEE d MMMM', { locale: fr });
    
    return {
      id: booking.id,
      type: 'spa_booking',
      title: `Réservation de spa`,
      description: `${formattedDate} à ${booking.time} - ${services[booking.service_id] || 'Service spa'}`,
      status: booking.status,
      time: new Date(booking.created_at || ''),
      link: `/spa/booking/${booking.id}`,
      data: {
        service_id: booking.service_id,
        facility_id: booking.facility_id,
        status: booking.status,
        date: booking.date,
        time: booking.time,
        room_number: booking.room_number,
        service_name: services[booking.service_id] || 'Service spa'
      }
    };
  });
};
