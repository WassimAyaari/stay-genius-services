
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/features/rooms/types';
import { toast } from 'sonner';

export const useServiceRequests = () => {
  const queryClient = useQueryClient();

  const fetchServiceRequests = async (): Promise<ServiceRequest[]> => {
    console.log('Fetching all service requests...');
    
    // Amélioré: requête plus claire avec une meilleure gestion des erreurs
    const { data: requestsData, error: requestsError } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (requestsError) {
      console.error('Error fetching service requests:', requestsError);
      throw requestsError;
    }

    console.log(`Fetched ${requestsData.length} service requests`);

    // Traiter chaque requête pour récupérer les données associées
    const requests = await Promise.all(
      requestsData.map(async (request) => {
        if (request.request_item_id) {
          try {
            // Récupérer l'élément de requête
            const { data: itemData, error: itemError } = await supabase
              .from('request_items')
              .select('*')
              .eq('id', request.request_item_id)
              .maybeSingle();

            if (itemError) {
              console.error(`Error fetching item for request ${request.id}:`, itemError);
              return request;
            }

            // Si nous avons un élément, récupérer sa catégorie séparément
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

            // Transformer les données pour correspondre au format attendu
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
    refetchInterval: 5000, // Rafraîchir plus fréquemment (toutes les 5 secondes)
    staleTime: 2000, // Considérer les données comme périmées après 2 secondes
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
