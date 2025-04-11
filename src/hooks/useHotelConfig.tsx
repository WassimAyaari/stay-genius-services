
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HotelConfig {
  id: string;
  name: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  enabled_features?: string[];
  contact_email?: string;
  contact_phone?: string;
  created_at?: string;
  updated_at?: string;
}

export function useHotelConfig() {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['hotelConfig'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('hotel_config')
          .select('*')
          .maybeSingle();
          
        if (error) throw error;
        
        if (!data) {
          // Return default config if no data exists
          return {
            id: 'default',
            name: 'Hotel Genius',
            primary_color: '#00AFB9',
            secondary_color: '#0F4C5C',
            enabled_features: ['rooms', 'dining', 'spa', 'events']
          } as HotelConfig;
        }
        
        return data as HotelConfig;
      } catch (error) {
        console.error('Error fetching hotel config:', error);
        // Return fallback config in case of error
        return {
          id: 'default',
          name: 'Hotel Genius',
          primary_color: '#00AFB9',
          secondary_color: '#0F4C5C',
          enabled_features: ['rooms', 'dining', 'spa', 'events']
        } as HotelConfig;
      }
    }
  });
  
  const updateConfig = useMutation({
    mutationFn: async (newConfig: Partial<HotelConfig>) => {
      const { data: existingConfig } = await supabase
        .from('hotel_config')
        .select('id')
        .single();
        
      let result;
      
      if (existingConfig) {
        // Update existing config
        const { data, error } = await supabase
          .from('hotel_config')
          .update(newConfig)
          .eq('id', existingConfig.id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        // Create new config - ensure required fields are present
        const configToInsert = {
          name: newConfig.name || 'Hotel Genius',
          primary_color: newConfig.primary_color || '#00AFB9',
          secondary_color: newConfig.secondary_color || '#0F4C5C',
          ...newConfig
        };
        
        const { data, error } = await supabase
          .from('hotel_config')
          .insert(configToInsert)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      
      return result as HotelConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotelConfig'] });
    }
  });
  
  return {
    config: data || {
      id: 'default',
      name: 'Hotel Genius',
      primary_color: '#00AFB9',
      secondary_color: '#0F4C5C',
      enabled_features: ['rooms', 'dining', 'spa', 'events']
    },
    isLoading,
    error,
    updateConfig: updateConfig.mutate
  };
}
