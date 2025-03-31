import { useHotelConfig } from './useHotelConfig';
import { useMutation } from '@tanstack/react-query';
import { HotelAbout } from '@/lib/types';

// This is a temporary adapter to provide the expected interface
// that the About pages are using until they can be updated
export function useAboutData() {
  const { config, isLoading, error, updateConfig } = useHotelConfig();
  
  // Transform hotelConfig into the aboutData format
  const aboutData: HotelAbout | null = config ? {
    id: config.id,
    welcome_title: config.name || 'Welcome to Our Hotel',
    welcome_description: 'Hotel Genius is a luxury hotel located in the heart of the city.',
    welcome_description_extended: 'Since our establishment, we have been committed to creating a home away from home for our guests.',
    directory_title: 'Hotel Directory & Information',
    mission: 'To provide exceptional hospitality experiences by creating memorable moments for our guests.',
    features: [
      { icon: 'History', title: 'Our History', description: 'Established with a rich heritage' },
      { icon: 'Building2', title: 'Our Property', description: 'Luxury rooms and premium facilities' },
      { icon: 'Users', title: 'Our Team', description: 'Dedicated staff committed to excellence' },
      { icon: 'Award', title: 'Our Awards', description: 'Recognized for outstanding service' }
    ],
    important_numbers: [
      { label: 'Reception', value: 'Dial 0' },
      { label: 'Room Service', value: 'Dial 1' },
      { label: 'Concierge', value: 'Dial 2' }
    ],
    facilities: [
      { label: 'Swimming Pool', value: 'Level 5' },
      { label: 'Fitness Center', value: 'Level 3' },
      { label: 'Spa & Wellness', value: 'Level 4' }
    ],
    hotel_policies: [
      { label: 'Check-in', value: '3:00 PM' },
      { label: 'Check-out', value: '12:00 PM' },
      { label: 'Breakfast', value: '6:30 AM - 10:30 AM' }
    ],
    additional_info: [
      { label: 'Wi-Fi', value: 'Network "HotelGenius" - Password provided at check-in' },
      { label: 'Parking', value: 'Valet service available' }
    ],
    created_at: config.created_at || new Date().toISOString(),
    updated_at: config.updated_at || new Date().toISOString()
  } : null;
  
  // Wrapper to adapt hotel config interface to what the About page expects
  const updateAboutData = useMutation({
    mutationFn: async (data: Partial<HotelAbout>) => {
      // In reality, we should map the about data to hotel config
      // but for now, we just pass it through
      return updateConfig({
        name: data.welcome_title,
        // Other properties that need to be mapped would go here
      });
    }
  });
  
  const createInitialAboutData = useMutation({
    mutationFn: async (data: Partial<HotelAbout>) => {
      // In reality, we should map the about data to hotel config
      // but for now, we just pass it through
      return updateConfig({
        name: data.welcome_title,
        // Other properties that need to be mapped would go here
      });
    }
  });
  
  return {
    aboutData,
    isLoadingAbout: isLoading,
    aboutError: error,
    updateAboutData: updateAboutData.mutate,
    createInitialAboutData: createInitialAboutData.mutate,
    // Also include the original hotel config for backward compatibility
    config,
    isLoading,
    error,
    updateConfig
  };
}
