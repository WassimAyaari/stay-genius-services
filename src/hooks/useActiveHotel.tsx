
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HotelAbout {
  id: string;
  hotel_id: string;
  title: string;
  description: string;
  icon: string;
  action_text: string;
  action_link: string;
  status: string;
}

export interface HotelService {
  id: string;
  hotel_id: string;
  title: string;
  description: string;
  icon: string;
  action_text: string;
  action_link: string;
  status: string;
  type: 'main' | 'additional';
  display_order: number;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  contact_email: string | null;
  contact_phone: string | null;
  logo_url: string | null;
}

interface UseActiveHotelReturn {
  hotel: Hotel | null;
  aboutSections: HotelAbout[];
  services: HotelService[];
  loading: boolean;
  error: Error | null;
}

export const useActiveHotel = (): UseActiveHotelReturn => {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [aboutSections, setAboutSections] = useState<HotelAbout[]>([]);
  const [services, setServices] = useState<HotelService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchActiveHotel = async () => {
      setLoading(true);
      try {
        // First, get all hotels and use the first one as active
        const { data: hotelsData, error: hotelsError } = await supabase
          .from('hotels')
          .select('*')
          .order('name')
          .limit(1);
        
        if (hotelsError) throw hotelsError;
        
        if (hotelsData && hotelsData.length > 0) {
          const activeHotel = hotelsData[0];
          setHotel(activeHotel);
          
          // Fetch about sections for this hotel
          const { data: aboutData, error: aboutError } = await supabase
            .from('hotel_about')
            .select('*')
            .eq('hotel_id', activeHotel.id)
            .eq('status', 'active')
            .order('title');
          
          if (aboutError) throw aboutError;
          setAboutSections(aboutData || []);
          
          // Fetch services for this hotel
          const { data: servicesData, error: servicesError } = await supabase
            .from('hotel_services')
            .select('*')
            .eq('hotel_id', activeHotel.id)
            .eq('status', 'active')
            .order('display_order');
          
          if (servicesError) throw servicesError;
          setServices(servicesData || []);
        }
      } catch (error) {
        console.error('Error fetching active hotel data:', error);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchActiveHotel();
  }, []);

  return { hotel, aboutSections, services, loading, error };
};
