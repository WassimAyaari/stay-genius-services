
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
    staleTime: 1000 * 60 * 15, // 15 minutes de cache
    cacheTime: 1000 * 60 * 30, // 30 minutes de cache
    retry: 1, // Limiter les tentatives de récupération en cas d'échec
    refetchOnMount: false, // Ne pas re-récupérer les données à chaque montage
    refetchOnWindowFocus: false, // Ne pas re-récupérer les données au focus de la fenêtre
  });
};
