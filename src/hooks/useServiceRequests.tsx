
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/features/rooms/types';
import { toast } from 'sonner';
import { ServiceRequestType } from '@/features/types/supabaseTypes';

export const useServiceRequests = () => {
  const queryClient = useQueryClient();

  const fetchServiceRequests = async (): Promise<ServiceRequest[]> => {
    console.log('Fetching all service requests...');
    
    // Query avec debug supplémentaire et options améliorées
    const { data: requestsData, error: requestsError } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (requestsError) {
      console.error('Error fetching service requests:', requestsError);
      throw requestsError;
    }

    console.log(`Fetched ${requestsData?.length || 0} service requests:`, requestsData);

    if (!requestsData || requestsData.length === 0) {
      console.log('No service requests found in database');
      return [];
    }

    // Traitement de chaque demande pour obtenir les données associées
    const requests = await Promise.all(
      requestsData.map(async (request) => {
        if (request.request_item_id) {
          try {
            // Obtenir l'élément de demande
            const { data: itemData, error: itemError } = await supabase
              .from('request_items')
              .select('*')
              .eq('id', request.request_item_id)
              .maybeSingle();

            if (itemError) {
              console.error(`Error fetching item for request ${request.id}:`, itemError);
              return request;
            }

            // Si nous avons un élément, obtenir sa catégorie séparément
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

  // Créer une collection de requêtes de test réalistes si aucune n'existe
  const createRealRequestExamples = async (): Promise<void> => {
    const { data: existingRequests } = await supabase
      .from('service_requests')
      .select('id')
      .limit(1);
    
    if (!existingRequests || existingRequests.length === 0) {
      console.log('Creating realistic service request examples...');
      
      // Collection de requêtes réalistes
      const realRequests = [
        {
          guest_id: 'guest-001',
          room_id: 'room-101',
          guest_name: 'Sophie Martin',
          room_number: '101',
          type: 'housekeeping',
          description: 'Changement de serviettes et nettoyage de la salle de bain',
          status: 'pending'
        },
        {
          guest_id: 'guest-002',
          room_id: 'room-203',
          guest_name: 'Thomas Bernard',
          room_number: '203',
          type: 'maintenance',
          description: 'Problème avec la climatisation',
          status: 'in_progress'
        },
        {
          guest_id: 'guest-003',
          room_id: 'room-305',
          guest_name: 'Émilie Dubois',
          room_number: '305',
          type: 'room_service',
          description: 'Commande petit-déjeuner pour 7h30',
          status: 'pending'
        },
        {
          guest_id: 'guest-004',
          room_id: 'room-118',
          guest_name: 'Pierre Lefèvre',
          room_number: '118',
          type: 'amenities',
          description: 'Demande d\'oreillers supplémentaires',
          status: 'completed'
        }
      ];
      
      // Insérer les requêtes une par une pour un meilleur débogage
      for (const request of realRequests) {
        const { error } = await supabase
          .from('service_requests')
          .insert(request);
          
        if (error) {
          console.error('Error creating realistic request:', error);
        }
      }
      
      console.log('Created realistic service requests successfully');
    }
  };

  const { data, isLoading, error, refetch, isError } = useQuery({
    queryKey: ['serviceRequests'],
    queryFn: fetchServiceRequests,
    refetchInterval: 10000, // Actualisation toutes les 10 secondes
    staleTime: 5000, // Considérer les données comme périmées après 5 secondes
    gcTime: 0, // Collecte immédiate des déchets
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
    isCancelling: cancelMutation.isPending,
    createRealRequestExamples
  };
};
