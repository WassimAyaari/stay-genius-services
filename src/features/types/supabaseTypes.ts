
// Custom type definitions for Supabase tables to avoid modifying the read-only types.ts file

// This type will be used whenever we need to access service_requests table
export interface ServiceRequestType {
  id: string;
  guest_id: string;
  room_id: string;
  type: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at?: string;
  request_item_id?: string;
  category_id?: string;
  guest_name?: string;
  room_number?: string;
}

// For chat_messages table
export interface ChatMessageType {
  id: string;
  user_id: string;
  recipient_id?: string | null;
  user_name: string;
  room_number: string;
  text: string;
  sender: 'user' | 'staff';
  status: 'sent' | 'delivered' | 'read';
  created_at: string;
  updated_at?: string;
}

// For request_categories table
export interface RequestCategoryType {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  icon?: string;
  created_at: string;
  updated_at?: string;
  parent_id?: string;
}

// For request_items table
export interface RequestItemType {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// For rooms table
export interface RoomType {
  id: string;
  room_number: string;
  type: string;
  floor: number;
  status: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  created_at?: string;
  updated_at?: string;
}

// For companions table
export interface CompanionType {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  relation: string;
  birth_date?: string;
  created_at?: string;
  updated_at?: string;
}

// For hotel_config table
export interface HotelConfigType {
  id: string;
  name: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  enabled_features: string[];
  contact_email?: string;
  contact_phone?: string;
  created_at?: string;
  updated_at?: string;
}
