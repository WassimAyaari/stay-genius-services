
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
      const { data, error } = await supabase
        .from('hotel_config')
        .select('*')
        .single();
        
      if (error) throw error;
      
      return data as HotelConfig;
    }
  });
  
  const updateConfig = useMutation({
    mutationFn: async (newConfig: Partial<HotelConfig>) => {
      const { data: existingConfig } = await supabase
        .from('hotel_config')
        .select('id')
        .single();
        
      const { data, error } = existingConfig
        ? await supabase
            .from('hotel_config')
            .update(newConfig)
            .eq('id', existingConfig.id)
            .select()
            .single()
        : await supabase
            .from('hotel_config')
            .insert([newConfig])
            .select()
            .single();
            
      if (error) throw error;
      
      return data as HotelConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotelConfig'] });
    }
  });
  
  return {
    config: data,
    isLoading,
    error,
    updateConfig: updateConfig.mutate
  };
}
