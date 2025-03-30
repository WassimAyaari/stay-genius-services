
import { ServiceType } from '@/features/rooms/types';

export interface Service {
  icon: React.ReactNode;
  label: string;
  type: ServiceType;
  description: string;
}
