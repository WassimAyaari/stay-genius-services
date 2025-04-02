
import { TableReservation } from '@/features/dining/types';
import { ServiceRequest } from '@/features/rooms/types';
import { NotificationItem } from '@/types/notification';

/**
 * Get restaurant name for a reservation
 */
export const getRestaurantName = () => {
  return 'Restaurant';
};

/**
 * Get icon for a service request type
 */
export const getRequestIcon = (type: string) => {
  switch (type) {
    case 'housekeeping': return '🧹';
    case 'laundry': return '👕';
    case 'wifi': return '📶';
    case 'room_service': return '🍲';
    case 'concierge': return '🔑';
    default: return '📋';
  }
};

/**
 * Get status text in French
 */
export const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'En attente';
    case 'in_progress': return 'En cours';
    case 'completed': return 'Complétée';
    case 'cancelled': return 'Annulée';
    default: return 'Inconnu';
  }
};

/**
 * Get reservation status text in French
 */
export const getReservationStatusText = (status: string) => {
  switch (status) {
    case 'confirmed': return 'Confirmée';
    case 'cancelled': return 'Annulée';
    case 'pending': return 'En attente';
    default: return 'Inconnu';
  }
};

/**
 * Transform service requests to notification items
 */
export const transformServiceRequests = (serviceRequests: ServiceRequest[]): NotificationItem[] => {
  return serviceRequests.map(request => ({
    id: request.id,
    type: 'request' as const,
    title: `Demande de service ${getStatusText(request.status)}`,
    description: `Votre demande de type ${request.type} est ${getStatusText(request.status).toLowerCase()}`,
    icon: getRequestIcon(request.type),
    status: request.status,
    time: new Date(request.created_at),
    link: `/requests/${request.id}`
  }));
};

/**
 * Transform reservations to notification items
 */
export const transformReservations = (reservations: TableReservation[]): NotificationItem[] => {
  return reservations.map(reservation => ({
    id: reservation.id,
    type: 'reservation' as const,
    title: `Réservation ${getReservationStatusText(reservation.status)}`,
    description: `Votre réservation pour ${reservation.guests} personnes le ${new Date(reservation.date).toLocaleDateString('fr-FR')} à ${reservation.time}`,
    icon: '🍽️',
    status: reservation.status,
    time: new Date(reservation.createdAt),
    link: `/reservations/${reservation.id}`
  }));
};

/**
 * Combine and sort all notifications by time (newest first)
 */
export const combineAndSortNotifications = (
  serviceRequests: ServiceRequest[],
  reservations: TableReservation[]
): NotificationItem[] => {
  const notifications = [
    ...transformServiceRequests(serviceRequests),
    ...transformReservations(reservations)
  ];
  
  return notifications.sort((a, b) => b.time.getTime() - a.time.getTime());
};
