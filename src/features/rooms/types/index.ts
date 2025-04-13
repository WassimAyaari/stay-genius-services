
export interface ServiceRequest {
  id: string;
  room_id: string;
  guest_id: string;
  type: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  request_item_id?: string;
  category_id?: string;
  guest_name?: string;
  room_number?: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  };
  request_items?: RequestItem;
}

export interface RequestCategory {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  icon?: string;
  created_at: string;
  updated_at: string;
  parent_id?: string;
}

export interface RequestItem {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Update ServiceType to only include basic service types
export type ServiceType = 'service' | 'custom';
