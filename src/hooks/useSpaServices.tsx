
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SpaService, SpaBooking } from '@/features/spa/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';

export const useSpaServices = (facilityId?: string) => {
  const queryClient = useQueryClient();
  const { toast: shadcnToast } = useToast();

  // Fetch all spa services or filter by facility ID
  const { data: services, isLoading, error } = useQuery({
    queryKey: ['spaServices', facilityId],
    queryFn: async () => {
      const query = supabase
        .from('spa_services')
        .select('*')
        .order('price');
      
      if (facilityId) {
        query.eq('facility_id', facilityId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as SpaService[];
    }
  });

  // Fetch featured spa services
  const { data: featuredServices } = useQuery({
    queryKey: ['featuredSpaServices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spa_services')
        .select('*')
        .eq('is_featured', true)
        .order('price');

      if (error) {
        throw error;
      }

      return data as SpaService[];
    }
  });

  // Create a new spa booking
  const createBookingMutation = useMutation({
    mutationFn: async (booking: Omit<SpaBooking, 'id'>) => {
      const { data, error } = await supabase
        .from('spa_bookings')
        .insert(booking)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaBookings'] });
      toast.success('Spa treatment booked successfully');
    },
    onError: (error) => {
      console.error('Error booking spa treatment:', error);
      shadcnToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to book spa treatment. Please try again."
      });
    }
  });

  // Get service by ID
  const getServiceById = async (id: string): Promise<SpaService | null> => {
    const { data, error } = await supabase
      .from('spa_services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching spa service:', error);
      return null;
    }

    return data;
  };

  return {
    services,
    featuredServices,
    isLoading,
    error,
    getServiceById,
    bookTreatment: createBookingMutation.mutate,
    isBooking: createBookingMutation.isPending
  };
};
