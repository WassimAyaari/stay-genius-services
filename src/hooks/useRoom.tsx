
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Room {
  id: string;
  room_number: string;
  type: string;
  floor: number;
  status: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  guest_id?: string;  // Added missing property
}

export const useRoom = (roomNumber?: string) => {
  return useQuery({
    queryKey: ['room', roomNumber],
    queryFn: async () => {
      if (!roomNumber) throw new Error("Room number is required");
      
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_number', roomNumber)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error(`Room ${roomNumber} not found`);
      
      return data as Room;
    },
    enabled: !!roomNumber,
  });
};
