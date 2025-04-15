
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HotelAbout, InfoItem, FeatureItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

// Helper function to safely parse JSON data to our expected types
const parseJsonArray = <T,>(data: Json | null, defaultValue: T[]): T[] => {
  if (!data) return defaultValue;
  
  // Handle case when data is already an array
  if (Array.isArray(data)) {
    return data as T[];
  }
  
  // If data is a string, try to parse it
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as T[];
    } catch (e) {
      console.error('Error parsing JSON string:', e);
      return defaultValue;
    }
  }
  
  // Fallback to default
  return defaultValue;
};

export function useAboutData() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['hotelAbout'],
    queryFn: async () => {
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

      // Default values
      const defaultImportantNumbers: InfoItem[] = [
        { label: 'Reception', value: 'Dial 0' },
        { label: 'Room Service', value: 'Dial 1' },
        { label: 'Concierge', value: 'Dial 2' }
      ];
      
      const defaultFacilities: InfoItem[] = [
        { label: 'Swimming Pool', value: 'Level 5' },
        { label: 'Fitness Center', value: 'Level 3' },
        { label: 'Spa & Wellness', value: 'Level 4' }
      ];
      
      const defaultPolicies: InfoItem[] = [
        { label: 'Check-in', value: '3:00 PM' },
        { label: 'Check-out', value: '12:00 PM' },
        { label: 'Breakfast', value: '6:30 AM - 10:30 AM' }
      ];
      
      const defaultAdditionalInfo: InfoItem[] = [
        { label: 'Wi-Fi', value: 'Network "HotelGenius" - Password provided at check-in' },
        { label: 'Parking', value: 'Valet service available' }
      ];
      
      const defaultFeatures: FeatureItem[] = [
        { icon: 'History', title: 'Our History', description: 'Established with a rich heritage' },
        { icon: 'Building2', title: 'Our Property', description: 'Luxury rooms and premium facilities' },
        { icon: 'Users', title: 'Our Team', description: 'Dedicated staff committed to excellence' },
        { icon: 'Award', title: 'Our Awards', description: 'Recognized for outstanding service' }
      ];

      // Default hero image if not provided
      const defaultHeroImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

      // Transform data to match the HotelAbout type with proper type conversion
      const transformedData: HotelAbout = {
        id: aboutData.id,
        welcome_title: aboutData.welcome_title || 'Welcome to Our Hotel',
        welcome_description: aboutData.welcome_description || 'Hotel Genius is a luxury hotel located in the heart of the city.',
        welcome_description_extended: aboutData.welcome_description_extended || 'Since our establishment, we have been committed to creating a home away from home for our guests.',
        directory_title: aboutData.directory_title || 'Hotel Directory & Information',
        // Access hero_image using optional chaining and with a type assertion since TypeScript doesn't know it exists
        hero_image: (aboutData as any).hero_image || defaultHeroImage,
        important_numbers: parseJsonArray<InfoItem>(aboutData.important_numbers, defaultImportantNumbers),
        facilities: parseJsonArray<InfoItem>(aboutData.facilities, defaultFacilities),
        hotel_policies: parseJsonArray<InfoItem>(aboutData.hotel_policies, defaultPolicies),
        additional_info: parseJsonArray<InfoItem>(aboutData.additional_info, defaultAdditionalInfo),
        features: parseJsonArray<FeatureItem>(aboutData.features, defaultFeatures),
        mission: aboutData.mission || 'To provide exceptional hospitality experiences by creating memorable moments for our guests.',
        created_at: aboutData.created_at || new Date().toISOString(),
        updated_at: aboutData.updated_at || new Date().toISOString()
      };
      
      return transformedData;
    }
  });
  
  // Helper function to convert our typed data back to JSON format for Supabase
  const prepareDataForUpdate = (data: Partial<HotelAbout>) => {
    const updateData: Record<string, any> = {};
    
    if (data.id) updateData.id = data.id;
    if (data.welcome_title) updateData.welcome_title = data.welcome_title;
    if (data.welcome_description) updateData.welcome_description = data.welcome_description;
    if (data.welcome_description_extended) updateData.welcome_description_extended = data.welcome_description_extended;
    if (data.directory_title) updateData.directory_title = data.directory_title;
    if (data.mission) updateData.mission = data.mission;
    if (data.hero_image) updateData.hero_image = data.hero_image;
    
    // Convert arrays back to JSON
    if (data.important_numbers) updateData.important_numbers = data.important_numbers;
    if (data.facilities) updateData.facilities = data.facilities;
    if (data.hotel_policies) updateData.hotel_policies = data.hotel_policies;
    if (data.additional_info) updateData.additional_info = data.additional_info;
    if (data.features) updateData.features = data.features;
    
    return updateData;
  };
  
  // Mutation to update about data
  const updateAboutMutation = useMutation({
    mutationFn: async (updatedData: Partial<HotelAbout>) => {
      console.log('Updating about data:', updatedData);
      
      const updatePayload = prepareDataForUpdate(updatedData);
      const id = updatedData.id || (data?.id);
      
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
    },
    onSuccess: () => {
      toast({
        title: "Mise à jour réussie",
        description: "Les informations de l'hôtel ont été mises à jour avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['hotelAbout'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Une erreur est survenue lors de la mise à jour: ${error.message}`,
      });
    }
  });
  
  // Mutation to create initial about data
  const createInitialAboutMutation = useMutation({
    mutationFn: async (initialData: Partial<HotelAbout>) => {
      console.log('Creating initial about data:', initialData);
      
      // Prepare the data for the insert
      const createPayload = {
        // Required fields for the hotel_about table
        title: 'About Our Hotel',
        description: 'Learn more about our hotel, facilities, and services.',
        icon: 'Info',
        action_text: 'Explore',
        action_link: '/about',
        status: 'active',

        // Add the fields from our initialData
        ...prepareDataForUpdate(initialData)
      };
      
      console.log('Create payload:', createPayload);
      
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
    },
    onSuccess: () => {
      toast({
        title: "Création réussie",
        description: "Les informations de l'hôtel ont été créées avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['hotelAbout'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Une erreur est survenue lors de la création: ${error.message}`,
      });
    }
  });
  
  return {
    aboutData: data,
    isLoadingAbout: isLoading,
    aboutError: error,
    updateAboutData: updateAboutMutation.mutate,
    createInitialAboutData: createInitialAboutMutation.mutate
  };
}
