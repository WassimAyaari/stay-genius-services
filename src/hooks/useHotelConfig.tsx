
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HotelConfig } from '@/lib/types';
import { toast } from 'sonner';

export const useHotelConfig = () => {
  const queryClient = useQueryClient();

  const fetchHotelConfig = async (): Promise<HotelConfig> => {
    const { data, error } = await supabase
      .from('hotel_config')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching hotel config:', error);
      throw error;
    }

    return data as HotelConfig;
  };

  const updateHotelConfig = async (config: Partial<HotelConfig>): Promise<HotelConfig> => {
    const { data, error } = await supabase
      .from('hotel_config')
      .update(config)
      .eq('id', config.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating hotel config:', error);
      throw error;
    }

    return data as HotelConfig;
  };

  const { data: hotelConfig, isLoading, error } = useQuery({
    queryKey: ['hotel-config'],
    queryFn: fetchHotelConfig,
  });

  const mutation = useMutation({
    mutationFn: updateHotelConfig,
    onSuccess: (data) => {
      queryClient.setQueryData(['hotel-config'], data);
      toast.success('Hotel configuration updated successfully');
    },
    onError: (error) => {
      console.error('Error updating hotel config:', error);
      toast.error('Failed to update hotel configuration');
    },
  });

  return {
    hotelConfig,
    isLoading,
    error,
    updateHotelConfig: mutation.mutate,
    isUpdating: mutation.isPending,
  };
};
