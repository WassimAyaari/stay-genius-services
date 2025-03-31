
import { supabase } from '@/integrations/supabase/client';
import { MenuItem } from '@/features/dining/types';

// Fetch all menu items for a restaurant
export const fetchMenuItems = async (restaurantId?: string): Promise<MenuItem[]> => {
  let query = supabase
    .from('restaurant_menus')
    .select('*')
    .order('category');
  
  if (restaurantId) {
    query = query.eq('restaurant_id', restaurantId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }

  // Convert from snake_case to camelCase
  return data.map(item => ({
    id: item.id,
    restaurantId: item.restaurant_id,
    name: item.name,
    description: item.description,
    price: Number(item.price),
    category: item.category,
    image: item.image,
    isFeatured: item.is_featured,
    status: item.status as 'available' | 'unavailable'
  }));
};

// Fetch a single menu item by ID
export const fetchMenuItemById = async (id: string): Promise<MenuItem> => {
  const { data, error } = await supabase
    .from('restaurant_menus')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching menu item with id ${id}:`, error);
    throw error;
  }

  // Convert from snake_case to camelCase
  return {
    id: data.id,
    restaurantId: data.restaurant_id,
    name: data.name,
    description: data.description,
    price: Number(data.price),
    category: data.category,
    image: data.image,
    isFeatured: data.is_featured,
    status: data.status as 'available' | 'unavailable'
  };
};

// Create a new menu item
export const createMenuItem = async (menuItem: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
  // Convert from camelCase to snake_case
  const { data, error } = await supabase
    .from('restaurant_menus')
    .insert({
      restaurant_id: menuItem.restaurantId,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      category: menuItem.category,
      image: menuItem.image,
      is_featured: menuItem.isFeatured,
      status: menuItem.status
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }

  // Convert from snake_case to camelCase for the returned data
  return {
    id: data.id,
    restaurantId: data.restaurant_id,
    name: data.name,
    description: data.description,
    price: Number(data.price),
    category: data.category,
    image: data.image,
    isFeatured: data.is_featured,
    status: data.status as 'available' | 'unavailable'
  };
};

// Update an existing menu item
export const updateMenuItem = async (menuItem: MenuItem): Promise<MenuItem> => {
  // Convert from camelCase to snake_case
  const { data, error } = await supabase
    .from('restaurant_menus')
    .update({
      restaurant_id: menuItem.restaurantId,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      category: menuItem.category,
      image: menuItem.image,
      is_featured: menuItem.isFeatured,
      status: menuItem.status
    })
    .eq('id', menuItem.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }

  // Convert from snake_case to camelCase for the returned data
  return {
    id: data.id,
    restaurantId: data.restaurant_id,
    name: data.name,
    description: data.description,
    price: Number(data.price),
    category: data.category,
    image: data.image,
    isFeatured: data.is_featured,
    status: data.status as 'available' | 'unavailable'
  };
};

// Delete a menu item
export const deleteMenuItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('restaurant_menus')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};
