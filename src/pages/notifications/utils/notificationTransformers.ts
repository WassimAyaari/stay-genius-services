
import { ServiceRequest } from '@/features/rooms/types';
import { TableReservation } from '@/features/dining/types';
import { NotificationItem } from '../types/notificationTypes';

/**
 * Transforms service requests into notification items
 */
export const transformServiceRequests = (requests: ServiceRequest[]): NotificationItem[] => {
  return requests.map(request => ({
    id: request.id,
    type: 'request' as const,
    title: `Demande de service`,
    description: request.type,
    status: request.status,
    time: new Date(request.created_at),
    link: `/requests/${request.id}`,
    data: request
  }));
};

/**
 * Transforms table reservations into notification items
 */
export const transformReservations = (reservations: TableReservation[]): NotificationItem[] => {
  return reservations.map(reservation => ({
    id: reservation.id,
    type: 'reservation' as const,
    title: `Réservation de table`,
    description: `${reservation.guests} personnes le ${new Date(reservation.date).toLocaleDateString('fr-FR')} à ${reservation.time}`,
    status: reservation.status,
    time: new Date(reservation.createdAt),
    link: `/reservations/${reservation.id}`,
    data: reservation
  }));
};

/**
 * Combines and sorts notifications by time (newest first)
 */
export const combineAndSortNotifications = (
  serviceRequests: ServiceRequest[], 
  reservations: TableReservation[]
): NotificationItem[] => {
  return [
    ...transformServiceRequests(serviceRequests),
    ...transformReservations(reservations)
  ].sort((a, b) => b.time.getTime() - a.time.getTime());
};
