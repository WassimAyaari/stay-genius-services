
export interface EventReservation {
  id: string;
  eventId: string;
  userId?: string;
  date: string;
  guests: number;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  roomNumber?: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
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
  status?: 'pending' | 'confirmed' | 'cancelled';
  guests?: number;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  roomNumber?: string;
  specialRequests?: string;
}
