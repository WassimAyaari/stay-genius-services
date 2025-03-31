
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HotelAbout } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function useAboutData() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['hotelAbout'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotel_about')
        .select('*')
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching hotel about data:', error);
        throw error;
      }
      
      if (!data) {
        return null;
      }

      // Transform data to match the HotelAbout type
      const aboutData: HotelAbout = {
        id: data.id,
        welcome_title: data.welcome_title || 'Welcome to Our Hotel',
        welcome_description: data.welcome_description || 'Hotel Genius is a luxury hotel located in the heart of the city.',
        welcome_description_extended: data.welcome_description_extended || 'Since our establishment, we have been committed to creating a home away from home for our guests.',
        directory_title: data.directory_title || 'Hotel Directory & Information',
        important_numbers: data.important_numbers || [
          { label: 'Reception', value: 'Dial 0' },
          { label: 'Room Service', value: 'Dial 1' },
          { label: 'Concierge', value: 'Dial 2' }
        ],
        facilities: data.facilities || [
          { label: 'Swimming Pool', value: 'Level 5' },
          { label: 'Fitness Center', value: 'Level 3' },
          { label: 'Spa & Wellness', value: 'Level 4' }
        ],
        hotel_policies: data.hotel_policies || [
          { label: 'Check-in', value: '3:00 PM' },
          { label: 'Check-out', value: '12:00 PM' },
          { label: 'Breakfast', value: '6:30 AM - 10:30 AM' }
        ],
        additional_info: data.additional_info || [
          { label: 'Wi-Fi', value: 'Network "HotelGenius" - Password provided at check-in' },
          { label: 'Parking', value: 'Valet service available' }
        ],
        features: data.features || [
          { icon: 'History', title: 'Our History', description: 'Established with a rich heritage' },
          { icon: 'Building2', title: 'Our Property', description: 'Luxury rooms and premium facilities' },
          { icon: 'Users', title: 'Our Team', description: 'Dedicated staff committed to excellence' },
          { icon: 'Award', title: 'Our Awards', description: 'Recognized for outstanding service' }
        ],
        mission: data.mission || 'To provide exceptional hospitality experiences by creating memorable moments for our guests.',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };
      
      return aboutData;
    }
  });
  
  // Mutation to update about data
  const updateAboutMutation = useMutation({
    mutationFn: async (updatedData: Partial<HotelAbout>) => {
      console.log('Updating about data:', updatedData);
      
      const { data, error } = await supabase
        .from('hotel_about')
        .update(updatedData)
        .eq('id', updatedData.id || data?.id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating hotel about data:', error);
        throw error;
      }
      
      return data;
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
  const createInitialAboutData = useMutation({
    mutationFn: async (initialData: Partial<HotelAbout>) => {
      const { data, error } = await supabase
        .from('hotel_about')
        .insert(initialData)
        .select()
        .single();
        
      if (error) throw error;
      
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
    createInitialAboutData: createInitialAboutData.mutate
  };
}
