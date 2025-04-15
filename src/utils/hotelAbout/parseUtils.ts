
import { Json } from '@/integrations/supabase/types';
import { InfoItem, FeatureItem } from '@/lib/types';

export const parseJsonArray = <T,>(data: Json | null, defaultValue: T[]): T[] => {
  if (!data) return defaultValue;
  
  if (Array.isArray(data)) {
    return data as T[];
  }
  
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as T[];
    } catch (e) {
      console.error('Error parsing JSON string:', e);
      return defaultValue;
    }
  }
  
  return defaultValue;
};

