
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Hotel, 
  HotelHero, 
  HotelService, 
  HotelExperience, 
  HotelEvent, 
  HotelAssistance 
} from '@/lib/types';

interface HotelData {
  hotel: Hotel | null;
  heroData: HotelHero | null;
  mainServices: HotelService[];
  additionalServices: HotelService[];
  experiences: HotelExperience[];
  events: HotelEvent[];
  assistance: HotelAssistance | null;
  loading: boolean;
  error: boolean;
}

export const fetchHotelData = async (hotelId: string): Promise<HotelData> => {
  try {
    // Fetch hotel information
    const { data: hotelData, error: hotelError } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', hotelId)
      .single();

    if (hotelError) throw hotelError;

    // Fetch hero section data
    const { data: heroData, error: heroError } = await supabase
      .from('hotel_hero')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('status', 'active')
      .maybeSingle();

    // Fetch main services
    const { data: mainServicesData, error: mainServicesError } = await supabase
      .from('hotel_services')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('type', 'main')
      .eq('status', 'active')
      .order('display_order', { ascending: true });

    // Fetch additional services
    const { data: additionalServicesData, error: additionalServicesError } = await supabase
      .from('hotel_services')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('type', 'additional')
      .eq('status', 'active')
      .order('display_order', { ascending: true });

    // Fetch experiences
    const { data: experiencesData, error: experiencesError } = await supabase
      .from('hotel_experiences')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('status', 'active')
      .order('display_order', { ascending: true });

    // Fetch events
    const { data: eventsData, error: eventsError } = await supabase
      .from('hotel_events')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('status', 'active')
      .order('display_order', { ascending: true });

    // Fetch assistance section data
    const { data: assistanceData, error: assistanceError } = await supabase
      .from('hotel_assistance')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('status', 'active')
      .maybeSingle();

    return {
      hotel: hotelData,
      heroData: !heroError && heroData ? heroData : null,
      mainServices: !mainServicesError ? mainServicesData || [] : [],
      additionalServices: !additionalServicesError ? additionalServicesData || [] : [],
      experiences: !experiencesError ? experiencesData || [] : [],
      events: !eventsError ? eventsData || [] : [],
      assistance: !assistanceError && assistanceData ? assistanceData : null,
      loading: false,
      error: false
    };
  } catch (error) {
    console.error('Error fetching hotel data:', error);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Impossible de charger les données de l'hôtel",
    });
    return {
      hotel: null,
      heroData: null,
      mainServices: [],
      additionalServices: [],
      experiences: [],
      events: [],
      assistance: null,
      loading: false,
      error: true
    };
  }
};

// Nouvelle fonction pour charger un hôtel par son sous-domaine
export const fetchHotelBySubdomain = async (subdomain: string): Promise<Hotel | null> => {
  try {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .eq('subdomain', subdomain)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching hotel by subdomain:', error);
    return null;
  }
};

// Mise à jour de la configuration d'un hôtel
export const updateHotelConfig = async (hotelId: string, config: any): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('hotels')
      .update({ config })
      .eq('id', hotelId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating hotel config:', error);
    return false;
  }
};
