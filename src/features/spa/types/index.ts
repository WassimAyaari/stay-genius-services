
export interface SpaService {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  category: 'massage' | 'facial' | 'body' | 'wellness';
  availability: 'available' | 'booked';
}

export interface SpaBooking {
  id: string;
  serviceId: string;
  date: string;
  time: string;
  guestId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  specialRequests?: string;
}
