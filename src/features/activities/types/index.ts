
export interface Activity {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  capacity: number;
  price: number;
  image: string;
  category: 'fitness' | 'entertainment' | 'culture' | 'sports';
  status: 'upcoming' | 'in-progress' | 'full' | 'cancelled';
}

export interface ActivityBooking {
  id: string;
  activityId: string;
  guestId: string;
  participants: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  specialRequests?: string;
}
