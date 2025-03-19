
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, Phone, Mail, MapPin } from 'lucide-react';
import HeroSection from '@/components/home/HeroSection';
import MainServicesSection from '@/components/home/MainServicesSection';
import AdditionalServicesSection from '@/components/home/AdditionalServicesSection';
import FeaturedExperienceSection from '@/components/home/FeaturedExperienceSection';
import TodayHighlightsSection from '@/components/home/TodayHighlightsSection';
import AssistanceSection from '@/components/home/AssistanceSection';

const HotelView = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [heroData, setHeroData] = useState<any>(null);
  const [mainServices, setMainServices] = useState<any[]>([]);
  const [additionalServices, setAdditionalServices] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [assistance, setAssistance] = useState<any>(null);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        
        // Fetch hotel information
        const { data: hotelData, error: hotelError } = await supabase
          .from('hotels')
          .select('*')
          .eq('id', id)
          .single();

        if (hotelError) throw hotelError;
        setHotel(hotelData);

        // Fetch hero section data
        const { data: heroData, error: heroError } = await supabase
          .from('hotel_hero')
          .select('*')
          .eq('hotel_id', id)
          .eq('status', 'active')
          .maybeSingle();

        if (!heroError && heroData) setHeroData(heroData);

        // Fetch main services
        const { data: mainServicesData, error: mainServicesError } = await supabase
          .from('hotel_services')
          .select('*')
          .eq('hotel_id', id)
          .eq('type', 'main')
          .eq('status', 'active')
          .order('display_order', { ascending: true });

        if (!mainServicesError) setMainServices(mainServicesData || []);

        // Fetch additional services
        const { data: additionalServicesData, error: additionalServicesError } = await supabase
          .from('hotel_services')
          .select('*')
          .eq('hotel_id', id)
          .eq('type', 'additional')
          .eq('status', 'active')
          .order('display_order', { ascending: true });

        if (!additionalServicesError) setAdditionalServices(additionalServicesData || []);

        // Fetch experiences
        const { data: experiencesData, error: experiencesError } = await supabase
          .from('hotel_experiences')
          .select('*')
          .eq('hotel_id', id)
          .eq('status', 'active')
          .order('display_order', { ascending: true });

        if (!experiencesError) setExperiences(experiencesData || []);

        // Fetch events
        const { data: eventsData, error: eventsError } = await supabase
          .from('hotel_events')
          .select('*')
          .eq('hotel_id', id)
          .eq('status', 'active')
          .order('display_order', { ascending: true });

        if (!eventsError) setEvents(eventsData || []);

        // Fetch assistance section data
        const { data: assistanceData, error: assistanceError } = await supabase
          .from('hotel_assistance')
          .select('*')
          .eq('hotel_id', id)
          .eq('status', 'active')
          .maybeSingle();

        if (!assistanceError && assistanceData) setAssistance(assistanceData);

      } catch (error) {
        console.error('Error fetching hotel data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHotelData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-4">Hôtel non trouvé</h1>
        <p className="text-lg text-gray-600 mb-6">
          L'hôtel que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Button asChild variant="default">
          <a href="/">Retourner à l'accueil</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {heroData && (
        <HeroSection 
          title={heroData.title}
          subtitle={heroData.subtitle}
          backgroundImage={heroData.background_image}
          searchPlaceholder={heroData.search_placeholder}
        />
      )}

      {/* Hotel Information */}
      <div className="bg-white py-6 px-4 md:px-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-primary">{hotel.name}</h1>
          <div className="flex flex-col md:flex-row gap-4 mt-2 text-gray-600">
            {hotel.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{hotel.address}</span>
              </div>
            )}
            {hotel.contact_phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{hotel.contact_phone}</span>
              </div>
            )}
            {hotel.contact_email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{hotel.contact_email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Services */}
      {mainServices.length > 0 && (
        <MainServicesSection services={mainServices} />
      )}

      {/* Featured Experience */}
      {experiences.length > 0 && (
        <FeaturedExperienceSection experiences={experiences} />
      )}

      {/* Today's Highlights */}
      {events.length > 0 && (
        <TodayHighlightsSection events={events} />
      )}

      {/* Additional Services */}
      {additionalServices.length > 0 && (
        <AdditionalServicesSection services={additionalServices} />
      )}

      {/* Assistance Section */}
      {assistance && (
        <AssistanceSection
          title={assistance.title}
          description={assistance.description}
          backgroundImage={assistance.background_image}
          actionText={assistance.action_text}
          actionLink={assistance.action_link}
        />
      )}
    </div>
  );
};

export default HotelView;
