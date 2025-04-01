
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
          try {
            // First fetch the request item
            const { data: itemData, error: itemError } = await supabase
              .from('request_items')
              .select('*')
              .eq('id', request.request_item_id)
              .single();

            if (itemError || !itemData) {
              console.error(`Error fetching item for request ${request.id}:`, itemError);
              return request;
            }

            // Then fetch the category separately
            let categoryName = null;
            if (itemData.category_id) {
              const { data: categoryData, error: categoryError } = await supabase
                .from('request_categories')
                .select('name')
                .eq('id', itemData.category_id)
                .single();

              if (!categoryError && categoryData) {
                categoryName = categoryData.name;
              }
            }

            // Transform the data to match our expected format
            return {
              ...request,
              request_items: {
                ...itemData,
                category_name: categoryName,
                category: categoryName ? { name: categoryName } : null
              }
            };
          } catch (error) {
            console.error(`Error processing request ${request.id}:`, error);
            return request;
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
