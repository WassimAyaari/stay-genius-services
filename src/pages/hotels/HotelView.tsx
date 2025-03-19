
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
        <div className="w-full bg-cover bg-center h-96" style={{ backgroundImage: `url(${heroData.background_image})` }}>
          <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-40">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{heroData.title}</h1>
              <p className="text-xl md:text-2xl mb-6">{heroData.subtitle}</p>
              <div className="relative max-w-md mx-auto">
                <input
                  type="text"
                  placeholder={heroData.search_placeholder}
                  className="w-full px-4 py-2 rounded-lg text-gray-800"
                />
              </div>
            </div>
          </div>
        </div>
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
        <div className="py-10 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Nos services principaux</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mainServices.map(service => (
                <div key={service.id} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Button asChild variant="outline" size="sm">
                    <a href={service.action_link}>{service.action_text}</a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Featured Experience */}
      {experiences.length > 0 && (
        <div className="py-10 bg-gray-50 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Expériences à découvrir</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experiences.slice(0, 2).map(experience => (
                <div key={experience.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${experience.image})` }}></div>
                  <div className="p-6">
                    <span className="text-sm text-primary font-medium">{experience.category}</span>
                    <h3 className="text-xl font-bold mt-1 mb-2">{experience.title}</h3>
                    <p className="text-gray-600 mb-4">{experience.description}</p>
                    <Button asChild>
                      <a href={experience.action_link}>{experience.action_text}</a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Today's Highlights */}
      {events.length > 0 && (
        <div className="py-10 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Événements à venir</h2>
            <div className="space-y-4">
              {events.slice(0, 3).map(event => (
                <div key={event.id} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row overflow-hidden">
                  <div className="md:w-1/4 h-48 md:h-auto bg-cover bg-center" style={{ backgroundImage: `url(${event.image})` }}></div>
                  <div className="p-4 md:w-3/4">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
                      <span>{event.date}</span>
                      <span>{event.time}</span>
                      <span>{event.location}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <Button asChild variant="outline">
                      <a href={event.action_link}>{event.action_text}</a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Additional Services */}
      {additionalServices.length > 0 && (
        <div className="py-10 bg-gray-50 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Services additionnels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalServices.map(service => (
                <div key={service.id} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Button asChild variant="outline" size="sm">
                    <a href={service.action_link}>{service.action_text}</a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Assistance Section */}
      {assistance && (
        <div className="py-10 px-4 md:px-8 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${assistance.background_image})` }}>
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">{assistance.title}</h2>
            <p className="text-xl mb-6">{assistance.description}</p>
            <Button asChild size="lg" variant="secondary">
              <a href={assistance.action_link}>{assistance.action_text}</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelView;
