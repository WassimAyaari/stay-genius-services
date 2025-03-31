
import { useHotelConfig, HotelConfig } from './useHotelConfig';
import { useMutation } from '@tanstack/react-query';

// This is a temporary adapter to provide the expected interface
// that the About pages are using until they can be updated
export function useAboutData() {
  const { config, isLoading, error, updateConfig } = useHotelConfig();
  
  // Wrapper to adapt hotel config interface to what the About page expects
  const updateAboutData = useMutation({
    mutationFn: async (data: any) => {
      // In reality, we should map the about data to hotel config
      // but for now, we just pass it through
      return updateConfig(data);
    }
  });
  
  const createInitialAboutData = useMutation({
    mutationFn: async (data: any) => {
      // In reality, we should map the about data to hotel config
      // but for now, we just pass it through
      return updateConfig(data);
    }
  });
  
  return {
    aboutData: config,
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
