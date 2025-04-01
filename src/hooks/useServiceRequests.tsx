
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/features/rooms/types';
import { toast } from 'sonner';

export const useServiceRequests = () => {
  const queryClient = useQueryClient();

  const fetchServiceRequests = async (): Promise<ServiceRequest[]> => {
    // First, fetch all service requests
    const { data: requestsData, error: requestsError } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (requestsError) {
      console.error('Error fetching service requests:', requestsError);
      throw requestsError;
    }

    // For each request that has a request_item_id, fetch the associated request item and category
    const requests = await Promise.all(
      requestsData.map(async (request) => {
        if (request.request_item_id) {
          // Fetch the request item and its category
          const { data: itemData, error: itemError } = await supabase
            .from('request_items')
            .select(`*, category:request_categories(name)`)
            .eq('id', request.request_item_id)
            .single();

          if (!itemError && itemData) {
            // Transform the data to match our expected format
            return {
              ...request,
              request_items: {
                ...itemData,
                category_name: itemData.category?.name || null
              }
            };
          }
        }
        return request;
      })
    );

    return requests as ServiceRequest[];
  };

  const cancelServiceRequest = async (requestId: string): Promise<void> => {
    const { error } = await supabase
      .from('service_requests')
      .update({ status: 'cancelled' })
      .eq('id', requestId);

    if (error) {
      console.error('Error cancelling service request:', error);
      throw error;
    }
  };

  const { data, isLoading, error, refetch, isError } = useQuery({
    queryKey: ['serviceRequests'],
    queryFn: fetchServiceRequests,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
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
