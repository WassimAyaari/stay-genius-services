
import { supabase } from '@/integrations/supabase/client';
import { HotelAbout } from '@/lib/types';
import { transformAboutData, prepareDataForUpdate } from '@/utils/hotelAbout/transformUtils';

export const fetchAboutData = async () => {
  const { data: aboutData, error } = await supabase
    .from('hotel_about')
    .select('*')
    .maybeSingle();
    
  if (error) {
    console.error('Error fetching hotel about data:', error);
    throw error;
  }
  
  if (!aboutData) {
    return null;
  }

  return transformAboutData(aboutData);
};

export const updateAboutData = async (updatedData: Partial<HotelAbout>) => {
  const updatePayload = prepareDataForUpdate(updatedData);
  const id = updatedData.id;
  
  if (!id) {
    throw new Error('No ID provided for update');
  }
  
  const { data: responseData, error } = await supabase
    .from('hotel_about')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating hotel about data:', error);
    throw error;
  }
  
  return responseData;
};

export const createInitialAbout = async (initialData: Partial<HotelAbout>) => {
  const createPayload = {
    title: 'About Our Hotel',
    description: 'Learn more about our hotel, facilities, and services.',
    icon: 'Info',
    action_text: 'Explore',
    action_link: '/about',
    status: 'active',
    ...prepareDataForUpdate(initialData)
  };
  
  const { data, error } = await supabase
    .from('hotel_about')
    .insert(createPayload)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating hotel about data:', error);
    throw error;
  }
  
  return data;
};

