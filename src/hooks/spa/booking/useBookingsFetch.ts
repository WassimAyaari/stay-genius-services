
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SpaBooking } from '@/features/spa/types';

/**
 * Hook pour récupérer toutes les réservations de spa
 */
export const useBookingsFetch = () => {
  // Fetch all spa bookings
  const fetchBookings = async (): Promise<SpaBooking[]> => {
    try {
      const { data, error } = await supabase
        .from('spa_bookings')
        .select(`
          *,
          spa_services:service_id (
            id,
            name,
            price,
            duration,
            description,
            category,
            image,
            status,
            facility_id
          )
        `)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching spa bookings:', error);
        throw error;
      }

      // Ensure we properly type the data that comes back
      const typedData = data?.map(booking => ({
        ...booking,
        status: booking.status as SpaBooking['status']
      }));

      return typedData as SpaBooking[];
    } catch (error) {
      console.error('Exception in fetchBookings:', error);
      return [];
    }
  };

  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ['spa-bookings'],
    queryFn: fetchBookings,
  });

  return {
    bookings: data,
    isLoading,
    error,
    refetch
  };
};
