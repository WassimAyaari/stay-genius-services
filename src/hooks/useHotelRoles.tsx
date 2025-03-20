
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HotelUserRole } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

export const useHotelRoles = (hotelId?: string, userId?: string) => {
  const queryClient = useQueryClient();

  const getRoles = async () => {
    let query = supabase.from('hotel_user_roles').select('*');
    
    if (hotelId) {
      query = query.eq('hotel_id', hotelId);
    }
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as HotelUserRole[];
  };

  const addRole = useMutation({
    mutationFn: async (newRole: { user_id: string; hotel_id: string; role: 'admin' | 'manager' | 'staff' | 'guest' }) => {
      const { data, error } = await supabase
        .from('hotel_user_roles')
        .insert(newRole)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-roles', hotelId] });
      toast({
        title: "Rôle ajouté",
        description: "Le rôle a été assigné avec succès",
      });
    },
    onError: (error) => {
      console.error('Error adding role:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le rôle",
      });
    }
  });

  const updateRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: 'admin' | 'manager' | 'staff' | 'guest' }) => {
      const { data, error } = await supabase
        .from('hotel_user_roles')
        .update({ role })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-roles', hotelId] });
      toast({
        title: "Rôle mis à jour",
        description: "Le rôle a été modifié avec succès",
      });
    },
    onError: (error) => {
      console.error('Error updating role:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le rôle",
      });
    }
  });

  const removeRole = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hotel_user_roles')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-roles', hotelId] });
      toast({
        title: "Rôle supprimé",
        description: "Le rôle a été supprimé avec succès",
      });
    },
    onError: (error) => {
      console.error('Error removing role:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le rôle",
      });
    }
  });

  const rolesQuery = useQuery({
    queryKey: ['hotel-roles', hotelId, userId],
    queryFn: getRoles,
    enabled: !!hotelId || !!userId,
  });

  return {
    roles: rolesQuery.data || [],
    isLoading: rolesQuery.isLoading,
    error: rolesQuery.error,
    addRole,
    updateRole,
    removeRole
  };
};

export const useUserHotels = (userId?: string) => {
  return useQuery({
    queryKey: ['user-hotels', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase.rpc('get_user_hotels', {
        user_id: userId
      });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};
