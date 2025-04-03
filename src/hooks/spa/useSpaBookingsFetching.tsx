
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SpaBooking } from '@/features/spa/types';
import { toast } from 'sonner';

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
  // Récupérer toutes les réservations spa
  const fetchBookings = async (): Promise<SpaBooking[]> => {
    try {
      const { data, error } = await supabase
        .from('spa_bookings')
        .select(`
          *,
          spa_services:service_id (
            name,
            price,
            duration,
            description,
            category
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

  // Récupérer les réservations d'un utilisateur
  const fetchUserBookings = async (userId: string): Promise<SpaBooking[]> => {
    try {
      console.log('Fetching bookings for user ID:', userId);
      const { data, error } = await supabase
        .from('spa_bookings')
        .select(`
          *,
          spa_services:service_id (
            name,
            price,
            duration,
            description,
            category
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

  // Récupérer une réservation par ID
  const getBookingById = async (id: string): Promise<ExtendedSpaBooking | null> => {
    console.log('Fetching booking by ID:', id);
    try {
      // Récupérer la réservation avec les détails du service
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
            facility_id,
            image,
            status
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching booking by ID:', error);
        toast.error('Erreur lors du chargement de la réservation');
        return null;
      }

      if (!data) {
        console.log('No booking found with ID:', id);
        toast.error('Réservation introuvable');
        return null;
      }

      console.log('Found booking with service details:', data);
      return data as unknown as ExtendedSpaBooking;
    } catch (error) {
      console.error('Exception in getBookingById:', error);
      toast.error('Erreur réseau lors du chargement de la réservation');
      return null;
    }
  };

  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ['spa-bookings'],
    queryFn: fetchBookings,
    retry: 1,
    staleTime: 60000, // 1 minute
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
