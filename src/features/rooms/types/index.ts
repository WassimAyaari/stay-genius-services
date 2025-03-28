
export interface ServiceRequest {
  id: string;
  room_id: string;
  guest_id: string;
  type: 'room_service' | 'housekeeping' | 'maintenance' | 'laundry' | string;
  category_id?: string;
  request_item_id?: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface RequestCategory {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RequestItem {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
