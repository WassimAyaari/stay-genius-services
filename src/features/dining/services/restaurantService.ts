
import { supabase } from '@/integrations/supabase/client';
import { Restaurant } from '@/features/dining/types';

/**
 * Fetches all restaurants from the database
 */
export const fetchRestaurants = async (): Promise<Restaurant[]> => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }

  // Convert from snake_case to camelCase
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    cuisine: item.cuisine,
    images: item.images,
    openHours: item.open_hours,
    location: item.location,
    status: item.status as 'open' | 'closed',
    actionText: item.action_text || "Book a Table", // Add default if not present
    isFeatured: item.is_featured || false
  }));
};

/**
 * Fetches a restaurant by its ID
 */
export const fetchRestaurantById = async (id: string): Promise<Restaurant> => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching restaurant with id ${id}:`, error);
    throw error;
  }

  // Convert from snake_case to camelCase
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    cuisine: data.cuisine,
    images: data.images,
    openHours: data.open_hours,
    location: data.location,
    status: data.status as 'open' | 'closed',
    actionText: data.action_text || "Book a Table", // Add default if not present
    isFeatured: data.is_featured || false
  };
};

/**
 * Fetches featured restaurants from the database
 */
export const fetchFeaturedRestaurants = async (): Promise<Restaurant[]> => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('is_featured', true)
    .order('name');

  if (error) {
    console.error('Error fetching featured restaurants:', error);
    throw error;
  }

  // Convert from snake_case to camelCase
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    cuisine: item.cuisine,
    images: item.images,
    openHours: item.open_hours,
    location: item.location,
    status: item.status as 'open' | 'closed',
    actionText: item.action_text || "Book a Table", // Add default if not present
    isFeatured: true
  }));
};

/**
 * Creates a new restaurant
 */
export const createRestaurant = async (restaurant: Omit<Restaurant, 'id'>): Promise<Restaurant> => {
  console.log('Creating restaurant with data:', restaurant);
  
  try {
    // Set RLS bypass to allow restaurant creation (this is temporary until proper RLS policies are set)
    const { data, error } = await supabase.rpc('create_restaurant', {
      p_name: restaurant.name,
      p_description: restaurant.description,
      p_cuisine: restaurant.cuisine,
      p_images: restaurant.images,
      p_open_hours: restaurant.openHours,
      p_location: restaurant.location,
      p_status: restaurant.status,
      p_action_text: restaurant.actionText,
      p_is_featured: restaurant.isFeatured
    });

    if (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }

    console.log('Created restaurant:', data);
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      cuisine: data.cuisine,
      images: data.images,
      openHours: data.open_hours,
      location: data.location,
      status: data.status as 'open' | 'closed',
      actionText: data.action_text || "Book a Table",
      isFeatured: data.is_featured || false
    };
  } catch (error) {
    // Fallback to direct insert if RPC function is not available
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .insert({
          name: restaurant.name,
          description: restaurant.description,
          cuisine: restaurant.cuisine,
          images: restaurant.images,
          open_hours: restaurant.openHours,
          location: restaurant.location,
          status: restaurant.status,
          action_text: restaurant.actionText,
          is_featured: restaurant.isFeatured
        })
        .select()
        .single();

      if (error) {
        console.error('Error in fallback restaurant creation:', error);
        throw error;
      }

      console.log('Created restaurant using fallback:', data);
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        cuisine: data.cuisine,
        images: data.images,
        openHours: data.open_hours,
        location: data.location,
        status: data.status as 'open' | 'closed',
        actionText: data.action_text || "Book a Table",
        isFeatured: data.is_featured || false
      };
    } catch (secondError) {
      console.error('All attempts to create restaurant failed:', secondError);
      throw new Error('Failed to create restaurant: ' + (secondError as Error).message);
    }
  }
};

/**
 * Updates an existing restaurant
 */
export const updateRestaurant = async (restaurant: Restaurant): Promise<Restaurant> => {
  console.log('Updating restaurant with data:', restaurant);
  
  // Verify required fields
  if (!restaurant.name || !restaurant.description || !restaurant.cuisine || 
      !restaurant.openHours || !restaurant.location || !restaurant.status) {
    throw new Error("Some required fields are missing");
  }

  try {
    // Convert from camelCase to snake_case
    const { data, error } = await supabase
      .from('restaurants')
      .update({
        name: restaurant.name,
        description: restaurant.description,
        cuisine: restaurant.cuisine,
        images: restaurant.images,
        open_hours: restaurant.openHours,
        location: restaurant.location,
        status: restaurant.status,
        action_text: restaurant.actionText, // Add the action_text field
        is_featured: restaurant.isFeatured || false // Add the is_featured field
      })
      .eq('id', restaurant.id)
      .select();

    if (error) {
      console.error('Error updating restaurant:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.error('No data returned from update');
      // Retrieve updated data directly
      const { data: fetchedData, error: fetchError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurant.id)
        .single();
        
      if (fetchError) {
        throw fetchError;
      }
      
      console.log('Fetched updated restaurant:', fetchedData);
      return {
        id: fetchedData.id,
        name: fetchedData.name,
        description: fetchedData.description,
        cuisine: fetchedData.cuisine,
        images: fetchedData.images,
        openHours: fetchedData.open_hours,
        location: fetchedData.location,
        status: fetchedData.status as 'open' | 'closed',
        actionText: fetchedData.action_text || "Book a Table", // Add default if not present
        isFeatured: fetchedData.is_featured || false
      };
    }

    console.log('Updated restaurant:', data[0]);
    // Convert from snake_case to camelCase for the returned data
    return {
      id: data[0].id,
      name: data[0].name,
      description: data[0].description,
      cuisine: data[0].cuisine,
      images: data[0].images,
      openHours: data[0].open_hours,
      location: data[0].location,
      status: data[0].status as 'open' | 'closed',
      actionText: data[0].action_text || "Book a Table", // Add default if not present
      isFeatured: data[0].is_featured || false
    };
  } catch (error) {
    console.error('Error in updateRestaurant:', error);
    throw error;
  }
};

/**
 * Deletes a restaurant by its ID
 */
export const deleteRestaurant = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('restaurants')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting restaurant:', error);
    throw error;
  }
};
