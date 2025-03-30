
import { RequestItem } from "@/features/rooms/types";

export interface ServiceRequestWithItem {
  id: string;
  guest_id?: string;
  guest_name?: string;
  room_id?: string;
  room_number?: string;
  type: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  request_item_id?: string;
  category_id?: string;
  request_items?: RequestItem;
}
