
import { SpaBooking } from '@/features/spa/types';

export interface ExtendedSpaBooking extends SpaBooking {
  spa_services?: {
    id: string;
    name: string;
    price: number;
    duration: string;
    description: string;
    category: string;
    image?: string;
    status?: string;
    facility_id?: string;
  };
}
