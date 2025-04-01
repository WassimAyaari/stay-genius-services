
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/features/rooms/types';
import { toast } from 'sonner';

export const useServiceRequests = () => {
  const queryClient = useQueryClient();

  const fetchServiceRequests = async (): Promise<ServiceRequest[]> => {
    console.log('Fetching all service requests...');
    
    // Improved: clearer query with better error handling and no caching
    const { data: requestsData, error: requestsError } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (requestsError) {
      console.error('Error fetching service requests:', requestsError);
      throw requestsError;
    }

    console.log(`Fetched ${requestsData.length} service requests`);

    // Process each request to get associated data
    const requests = await Promise.all(
      requestsData.map(async (request) => {
        if (request.request_item_id) {
          try {
            // Get the request item
            const { data: itemData, error: itemError } = await supabase
              .from('request_items')
              .select('*')
              .eq('id', request.request_item_id)
              .maybeSingle();

            if (itemError) {
              console.error(`Error fetching item for request ${request.id}:`, itemError);
              return request;
            }

            // If we have an item, get its category separately
            let categoryName = null;
            if (itemData && itemData.category_id) {
              const { data: categoryData, error: categoryError } = await supabase
                .from('request_categories')
                .select('name')
                .eq('id', itemData.category_id)
                .maybeSingle();
                
              if (!categoryError && categoryData) {
                categoryName = categoryData.name;
              }
            }

            // Transform data to match expected format
            return {
              ...request,
              request_items: itemData ? {
                ...itemData,
                category_name: categoryName,
                category: categoryName ? { name: categoryName } : null
              } : null
            };
          } catch (error) {
            console.error(`Error processing request ${request.id}:`, error);
            return request;
          }
        }
        return request;
      })
    );

    console.log(`Processed ${requests.length} service requests with details`);
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
    refetchInterval: 3000, // More frequent refresh (every 3 seconds)
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Immediate garbage collection
    retry: 3,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
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
