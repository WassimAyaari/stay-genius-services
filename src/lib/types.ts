
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  room_number: string;
  floor: number;
  type: string;
  view_type: string | null;
  status: string;
}

export interface ServiceRequest {
  id: string;
  guest_id: string;
  room_id: string;
  type: string;
  description: string | null;
  status: string;
  created_at: string;
}
