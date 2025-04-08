
import { EventReservation, CreateEventReservationDTO } from '@/types/event';
import { EventReservationRow } from '../../types/eventReservation';

/**
 * Map a DTO to a row structure for database insertion
 */
export const mapDtoToRow = (dto: CreateEventReservationDTO, userId: string | null): EventReservationRow => {
  // Return a complete EventReservationRow with all required fields
  return {
    event_id: dto.eventId,
    user_id: userId || null,
    guest_name: dto.guestName || null,
    guest_email: dto.guestEmail || null,
    guest_phone: dto.guestPhone || null,
    room_number: dto.roomNumber || null,
    date: dto.date, // Ensure date is always provided
    guests: dto.guests,
    special_requests: dto.specialRequests || null,
    status: dto.status || 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    id: crypto.randomUUID() // Generate a UUID for new records
  };
};

/**
 * Map a database row to an EventReservation object
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
