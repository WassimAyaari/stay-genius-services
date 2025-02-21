
import { ServiceType } from '@/features/rooms/controllers/roomService';

export interface Service {
  icon: React.ReactNode;
  label: string;
  type: ServiceType;
  description: string;
}
