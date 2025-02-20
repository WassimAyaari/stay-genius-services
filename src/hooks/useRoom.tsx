
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Room {
  id: string;
  room_number: string;
  type: string;
  floor: number;
  status: string;
  view_type: string | null;
  description: string | null;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
}

export const useRoom = (roomNumber?: string) => {
  return useQuery({
    queryKey: ['room', roomNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_number', roomNumber)
        .maybeSingle();

      if (error) throw error;
      return data as Room;
    },
    enabled: !!roomNumber,
  });
};
