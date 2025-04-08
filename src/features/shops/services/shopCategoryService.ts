
import { supabase } from '@/integrations/supabase/client';
import { ShopCategory, ShopCategoryFormData } from '@/types/shop';

export const fetchShopCategories = async (): Promise<ShopCategory[]> => {
  const { data, error } = await supabase
    .from('shop_categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching shop categories:', error);
    throw new Error('Failed to fetch shop categories');
  }
  
  return data || [];
};

export const fetchShopCategoryById = async (id: string): Promise<ShopCategory | null> => {
  const { data, error } = await supabase
    .from('shop_categories')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching shop category:', error);
    throw new Error('Failed to fetch shop category');
  }
  
  return data;
};

export const createShopCategory = async (category: ShopCategoryFormData): Promise<ShopCategory> => {
  const { data, error } = await supabase
    .from('shop_categories')
    .insert(category)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating shop category:', error);
    throw new Error('Failed to create shop category');
  }
  
  return data;
};

export const updateShopCategory = async (id: string, category: ShopCategoryFormData): Promise<ShopCategory> => {
  const { data, error } = await supabase
    .from('shop_categories')
    .update(category)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating shop category:', error);
    throw new Error('Failed to update shop category');
  }
  
  return data;
};

export const deleteShopCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('shop_categories')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting shop category:', error);
    throw new Error('Failed to delete shop category');
  }
};
