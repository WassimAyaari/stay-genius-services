
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RequestCategory, RequestItem } from '@/features/rooms/types';
import { RequestCategoryType, RequestItemType } from '@/features/types/supabaseTypes';

export function useRequestCategories() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['requestCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('request_categories')
        .select('*')
        .order('name');

      if (error) {
        console.error("Error fetching request categories:", error);
        throw error;
      }

      return data as RequestCategory[];
    }
  });

  const { data: allItems, isLoading: isItemsLoading } = useQuery({
    queryKey: ['requestItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('request_items')
        .select('*')
        .order('name');

      if (error) {
        console.error("Error fetching request items:", error);
        throw error;
      }

      return data as RequestItem[];
    },
    enabled: !isCategoriesLoading // Only run after categories are loaded
  });

  // Create a new category
  const addCategory = useMutation({
    mutationFn: async (newCategory: Omit<RequestCategory, 'id' | 'created_at' | 'updated_at'>) => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('request_categories')
          .insert({
            name: newCategory.name,
            description: newCategory.description,
            is_active: newCategory.is_active,
            icon: newCategory.icon,
            parent_id: newCategory.parent_id
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requestCategories'] });
    }
  });

  // Update an existing category
  const updateCategory = useMutation({
    mutationFn: async (category: RequestCategory) => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('request_categories')
          .update({
            name: category.name,
            description: category.description,
            is_active: category.is_active,
            icon: category.icon,
            parent_id: category.parent_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', category.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requestCategories'] });
    }
  });

  // Create a new item in a category
  const addItem = useMutation({
    mutationFn: async (newItem: Omit<RequestItem, 'id' | 'created_at' | 'updated_at'>) => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('request_items')
          .insert({
            name: newItem.name,
            description: newItem.description,
            category_id: newItem.category_id,
            is_active: newItem.is_active
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requestItems'] });
    }
  });

  // Update an existing item
  const updateItem = useMutation({
    mutationFn: async (item: RequestItem) => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('request_items')
          .update({
            name: item.name,
            description: item.description,
            category_id: item.category_id,
            is_active: item.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requestItems'] });
    }
  });

  return {
    categories,
    allItems,
    isLoading: isLoading || isCategoriesLoading || isItemsLoading,
    addCategory: addCategory.mutate,
    updateCategory: updateCategory.mutate,
    addItem: addItem.mutate,
    updateItem: updateItem.mutate
  };
}

export function useRequestItems(categoryId?: string) {
  return useQuery({
    queryKey: ['requestItems', categoryId],
    queryFn: async () => {
      if (!categoryId) return [];

      const { data, error } = await supabase
        .from('request_items')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error(`Error fetching items for category ${categoryId}:`, error);
        throw error;
      }

      return data as RequestItem[];
    },
    enabled: !!categoryId // Only run when we have a categoryId
  });
}
