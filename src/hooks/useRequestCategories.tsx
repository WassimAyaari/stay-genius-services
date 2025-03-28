
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RequestCategory, RequestItem } from '@/features/rooms/types';

export const useRequestCategories = () => {
  return useQuery({
    queryKey: ['request-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('request_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data as RequestCategory[];
    },
  });
};

export const useRequestItems = (categoryId?: string) => {
  return useQuery({
    queryKey: ['request-items', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('request_items')
        .select('*')
        .eq('is_active', true);
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query.order('name');

      if (error) throw error;
      return data as RequestItem[];
    },
    enabled: !!categoryId,
  });
};

export const useCreateRequestCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (category: Omit<RequestCategory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('request_categories')
        .insert(category)
        .select()
        .single();
      
      if (error) throw error;
      return data as RequestCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['request-categories'] });
    },
  });
};

export const useUpdateRequestCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...category }: Partial<RequestCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from('request_categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as RequestCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['request-categories'] });
    },
  });
};

export const useCreateRequestItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: Omit<RequestItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('request_items')
        .insert(item)
        .select()
        .single();
      
      if (error) throw error;
      return data as RequestItem;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['request-items', variables.category_id] });
    },
  });
};

export const useUpdateRequestItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...item }: Partial<RequestItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('request_items')
        .update(item)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as RequestItem;
    },
    onSuccess: (_, variables) => {
      if ('category_id' in variables) {
        queryClient.invalidateQueries({ queryKey: ['request-items', variables.category_id] });
      }
    },
  });
};
