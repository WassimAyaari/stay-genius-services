
import { EventReservation } from '@/types/event';
import { EventReservationRow } from '../../types/eventReservation';
import { CreateEventReservationDTO } from '@/types/event';

/**
 * Map a row from the database to an EventReservation
 */
export const mapRowToEventReservation = (row: EventReservationRow): EventReservation => {
  return {
    id: row.id,
    eventId: row.event_id,
    userId: row.user_id || undefined,
    guestName: row.guest_name || undefined,
    guestEmail: row.guest_email || undefined,
    guestPhone: row.guest_phone || undefined,
    roomNumber: row.room_number || undefined,
    date: row.date,
    guests: row.guests,
    specialRequests: row.special_requests || undefined,
    status: row.status as 'pending' | 'confirmed' | 'cancelled',
    createdAt: row.created_at
  };
};

/**
 * Map a DTO to a row for the database
 */
export const mapDtoToRow = (dto: CreateEventReservationDTO, userId?: string | null): Partial<EventReservationRow> => {
  return {
    event_id: dto.eventId,
    user_id: userId || null,
    guest_name: dto.guestName || null,
    guest_email: dto.guestEmail || null,
    guest_phone: dto.guestPhone || null,
    room_number: dto.roomNumber || null,
    date: dto.date,
    guests: dto.guests,
    special_requests: dto.specialRequests || null,
    status: dto.status || 'pending',
  };
};
