
export interface Activity {
  id: string;
  name: string;
  description: string | null;
  date: string;
  time: string;
  duration: string;
  location: string;
  capacity: number;
  price: number;
  image: string | null;
  category: 'fitness' | 'entertainment' | 'culture' | 'sports';
  status: 'upcoming' | 'in-progress' | 'full' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

export interface ActivityBooking {
  id: string;
  activity_id: string;
  user_id: string;
  participants: number;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}
