
export interface ServiceRequest {
  id: string;
  room_id: string;
  guest_id: string;
  type: 'room_service' | 'housekeeping' | 'maintenance' | 'laundry';
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}
