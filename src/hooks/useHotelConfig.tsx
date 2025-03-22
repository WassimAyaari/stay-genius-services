
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

  const fetchHotelAbout = async () => {
    const { data, error } = await supabase
      .from('hotel_about')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching hotel about:', error);
      throw error;
    }

    return data;
  };

  const updateHotelAbout = async (aboutData) => {
    const { data, error } = await supabase
      .from('hotel_about')
      .update(aboutData)
      .eq('id', aboutData.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating hotel about:', error);
      throw error;
    }

    return data;
  };

  const { data: hotelConfig, isLoading, error } = useQuery({
    queryKey: ['hotel-config'],
    queryFn: fetchHotelConfig,
  });

  const { data: aboutData, isLoading: isLoadingAbout, error: aboutError } = useQuery({
    queryKey: ['hotel-about'],
    queryFn: fetchHotelAbout,
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

  const aboutMutation = useMutation({
    mutationFn: updateHotelAbout,
    onSuccess: (data) => {
      queryClient.setQueryData(['hotel-about'], data);
      toast.success('About section updated successfully');
    },
    onError: (error) => {
      console.error('Error updating about section:', error);
      toast.error('Failed to update about section');
    },
  });

  return {
    hotelConfig,
    isLoading,
    error,
    updateHotelConfig: mutation.mutate,
    isUpdating: mutation.isPending,
    
    // About section data and functions
    aboutData,
    isLoadingAbout,
    aboutError,
    updateAboutData: aboutMutation.mutate,
    isUpdatingAbout: aboutMutation.isPending,
  };
};
