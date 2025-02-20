
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  images: string[];
  openHours: string;
  location: string;
  status: 'open' | 'closed';
}

export interface DiningReservation {
  id: string;
  restaurantId: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}
