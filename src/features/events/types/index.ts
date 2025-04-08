export type EventReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface EventReservation {
  id: string;
  eventId: string;
  userId?: string;
  date: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  roomNumber?: string;
  specialRequests?: string;
  status: EventReservationStatus;
  createdAt: string;
  updatedAt: string;
  event?: {
    title: string;
    description: string;
    image?: string;
    location?: string;
    time?: string;
  };
}

export interface CreateEventReservationDTO {
  eventId: string;
  userId?: string;
  date: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  roomNumber?: string;
  specialRequests?: string;
}

export interface UpdateEventReservationDTO {
  id: string;
  status?: EventReservationStatus;
  guests?: number;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  roomNumber?: string;
  specialRequests?: string;
}
