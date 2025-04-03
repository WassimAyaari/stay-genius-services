
export interface SpaFacility {
  id: string;
  name: string;
  description?: string;
  location?: string;
  image_url?: string;
  capacity?: number | null;
  opening_hours?: string;
  status: 'open' | 'closed';
  created_at?: string;
  updated_at?: string;
}

export interface SpaService {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  category: 'massage' | 'facial' | 'body' | 'wellness' | string;
  facility_id?: string;
  is_featured?: boolean;
  status: 'available' | 'unavailable' | string;
  created_at?: string;
  updated_at?: string;
}

export interface SpaBooking {
  id: string;
  service_id: string;
  facility_id: string;
  user_id?: string;
  date: string;
  time: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  room_number?: string;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at?: string;
  updated_at?: string;
  spa_services?: Partial<SpaService>;
}
