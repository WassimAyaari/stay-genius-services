
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
  // Récupérer toutes les réservations spa
  const fetchBookings = async (): Promise<SpaBooking[]> => {
    try {
      console.log('Récupération de toutes les réservations spa');
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
        console.error('Erreur lors de la récupération des réservations spa:', error);
        throw error;
      }

      console.log(`${data?.length || 0} réservations récupérées`);
      return data as unknown as SpaBooking[];
    } catch (error) {
      console.error('Exception dans fetchBookings:', error);
      throw error;
    }
  };

  // Récupérer les réservations d'un utilisateur
  const fetchUserBookings = async (userId: string): Promise<SpaBooking[]> => {
    try {
      console.log('Récupération des réservations pour l\'utilisateur:', userId);
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
        console.error('Erreur lors de la récupération des réservations utilisateur:', error);
        throw error;
      }

      console.log(`${data?.length || 0} réservations trouvées pour l'utilisateur`);
      return data as unknown as SpaBooking[];
    } catch (error) {
      console.error('Exception dans fetchUserBookings:', error);
      return [];
    }
  };

  // Récupérer une réservation par ID
  const getBookingById = async (id: string): Promise<ExtendedSpaBooking | null> => {
    try {
      console.log('Récupération de la réservation par ID:', id);
      
      if (!id) {
        console.error('ID de réservation invalide');
        return null;
      }
      
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
        console.error('Erreur lors de la récupération de la réservation par ID:', error);
        return null;
      }

      if (!data) {
        console.log('Aucune réservation trouvée avec l\'ID:', id);
        return null;
      }

      console.log('Réservation trouvée avec les détails du service:', data);
      return data as unknown as ExtendedSpaBooking;
    } catch (error) {
      console.error('Exception dans getBookingById:', error);
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
