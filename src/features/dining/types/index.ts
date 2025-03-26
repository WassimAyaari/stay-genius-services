
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  images: string[];
  openHours: string;
  location: string;
  status: 'open' | 'closed';
  actionText?: string;
  isFeatured?: boolean;
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

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isFeatured: boolean;
  status: 'available' | 'unavailable';
}

export interface TableReservation {
  id: string;
  restaurantId: string;
  userId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
