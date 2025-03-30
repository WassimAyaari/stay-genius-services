
import { RequestItem, ServiceRequest } from '@/features/rooms/types';

export interface ServiceRequestWithItem extends ServiceRequest {
  request_items?: RequestItem | null;
}
