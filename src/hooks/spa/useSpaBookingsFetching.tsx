
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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

export const useSpaBookingsFetching = () => {
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

      return data as unknown as SpaBooking[];
    } catch (error) {
      console.error('Exception in fetchBookings:', error);
      return [];
    }
  };

  // Fetch bookings for a specific user
  const fetchUserBookings = async (userId: string): Promise<SpaBooking[]> => {
    try {
      console.log('Fetching bookings for user ID:', userId);
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
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching user spa bookings:', error);
        throw error;
      }

      console.log('Found bookings for user:', data?.length || 0);
      return data as unknown as SpaBooking[];
    } catch (error) {
      console.error('Exception in fetchUserBookings:', error);
      return [];
    }
  };

  // Fetch a booking by ID
  const getBookingById = async (id: string): Promise<ExtendedSpaBooking | null> => {
    if (!id) {
      console.error('No booking ID provided to getBookingById');
      return null;
    }
    
    console.log('Fetching booking by ID:', id);
    try {
      // Get the booking with service details
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
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching booking by ID:', error);
        return null;
      }

      if (!data) {
        console.log('No booking found with ID:', id);
        
        // Double-check if the booking exists without the joins
        const { data: simpleData, error: simpleError } = await supabase
          .from('spa_bookings')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        if (simpleError) {
          console.error('Error fetching simple booking by ID:', simpleError);
          return null;
        }
        
        if (!simpleData) {
          console.log('No booking exists with ID:', id);
          return null;
        }
        
        console.log('Found booking without service details:', simpleData);
        return simpleData as ExtendedSpaBooking;
      }

      console.log('Found booking with service details:', data);
      return data as unknown as ExtendedSpaBooking;
    } catch (error) {
      console.error('Exception in getBookingById:', error);
      return null;
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
    getBookingById,
    fetchUserBookings,
    refetch
  };
};
