
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/features/rooms/types';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

export const useServiceRequests = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const fetchServiceRequests = async (): Promise<ServiceRequest[]> => {
    if (!user?.id) {
      console.log('No authenticated user, returning empty service requests');
      return [];
    }

    console.log('Fetching service requests for auth user:', user.id);
    
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('guest_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching service requests:', error);
      throw error;
    }

    console.log('Service requests data retrieved:', data?.length || 0);
    return data as ServiceRequest[];
  };

  const cancelServiceRequest = async (requestId: string): Promise<void> => {
    const { error } = await supabase
      .from('service_requests')
      .update({ status: 'cancelled' })
      .eq('id', requestId)
      .eq('guest_id', user?.id); // Ensure only the user's requests can be cancelled

    if (error) {
      console.error('Error cancelling service request:', error);
      throw error;
    }
  };

  const { data, isLoading, error, refetch, isError } = useQuery({
    queryKey: ['serviceRequests', user?.id],
    queryFn: fetchServiceRequests,
    enabled: !!user?.id // Only fetch when user is authenticated
  });

  const cancelMutation = useMutation({
    mutationFn: cancelServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests', user?.id] });
      toast.success('Demande annulée avec succès');
    },
    onError: (error) => {
      console.error('Error cancelling request:', error);
      toast.error("Erreur lors de l'annulation de la demande");
    }
  });

  return {
    data,
    isLoading,
    error,
    isError,
    refetch,
    cancelRequest: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending
  };
};
