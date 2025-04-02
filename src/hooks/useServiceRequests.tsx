
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/features/rooms/types';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { useLocation } from 'react-router-dom';

export const useServiceRequests = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const location = useLocation();
  const userId = user?.id || localStorage.getItem('user_id');
  
  // Check if we're in the admin section
  const isAdminSection = location.pathname.includes('/admin');

  const fetchServiceRequests = async (): Promise<ServiceRequest[]> => {
    if (!userId && !isAdminSection) {
      console.log('No authenticated user or user_id in localStorage, returning empty service requests');
      return [];
    }

    // For admin section, fetch all requests with nested relations to get room and guest info
    if (isAdminSection) {
      console.log('Admin view: Fetching all service requests with related data');
      
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          request_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching service requests:', error);
        throw error;
      }

      console.log('Service requests data retrieved:', data?.length || 0);
      return data as ServiceRequest[];
    } else {
      // For user view, just fetch their own requests
      console.log('Fetching service requests for user ID:', userId);
      
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('guest_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching service requests:', error);
        throw error;
      }

      console.log('Service requests data retrieved:', data?.length || 0);
      return data as ServiceRequest[];
    }
  };

  const cancelServiceRequest = async (requestId: string): Promise<void> => {
    if (!userId && !isAdminSection) {
      toast.error("Veuillez vous connecter pour annuler une demande");
      throw new Error("Utilisateur non authentifié");
    }

    let query = supabase
      .from('service_requests')
      .update({ status: 'cancelled' })
      .eq('id', requestId);
      
    // Only apply user filter if not in admin section
    if (!isAdminSection) {
      query = query.eq('guest_id', userId);
    }

    const { error } = await query;

    if (error) {
      console.error('Error cancelling service request:', error);
      throw error;
    }
  };

  const { data, isLoading, error, refetch, isError } = useQuery({
    queryKey: ['serviceRequests', userId, isAdminSection],
    queryFn: fetchServiceRequests,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  const cancelMutation = useMutation({
    mutationFn: cancelServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests', userId, isAdminSection] });
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
