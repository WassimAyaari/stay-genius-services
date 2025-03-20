
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchHotelData } from './services/hotelServices';
import { 
  Hotel, 
  HotelHero, 
  HotelService, 
  HotelExperience, 
  HotelEvent, 
  HotelAssistance 
} from '@/lib/types';

import HotelViewLoading from './components/HotelViewLoading';
import HotelNotFound from './components/HotelNotFound';
import HotelHeroSection from './components/HotelHeroSection';
import HotelInformation from './components/HotelInformation';
import HotelServiceSection from './components/HotelServiceSection';
import HotelExperienceSection from './components/HotelExperienceSection';
import HotelEventsSection from './components/HotelEventsSection';
import HotelAssistanceSection from './components/HotelAssistanceSection';

const HotelView = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroData, setHeroData] = useState<HotelHero | null>(null);
  const [mainServices, setMainServices] = useState<HotelService[]>([]);
  const [additionalServices, setAdditionalServices] = useState<HotelService[]>([]);
  const [experiences, setExperiences] = useState<HotelExperience[]>([]);
  const [events, setEvents] = useState<HotelEvent[]>([]);
  const [assistance, setAssistance] = useState<HotelAssistance | null>(null);

  useEffect(() => {
    const getHotelData = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        const data = await fetchHotelData(id);
        
        setHotel(data.hotel);
        setHeroData(data.heroData);
        setMainServices(data.mainServices);
        setAdditionalServices(data.additionalServices);
        setExperiences(data.experiences);
        setEvents(data.events);
        setAssistance(data.assistance);
      } finally {
        setLoading(false);
      }
    };

    getHotelData();
  }, [id]);

  if (loading) {
    return <HotelViewLoading />;
  }

  if (!hotel) {
    return <HotelNotFound />;
  }

  return (
    <div className="min-h-screen">
      <HotelHeroSection heroData={heroData} />
      <HotelInformation hotel={hotel} />
      <HotelServiceSection services={mainServices} title="Nos services principaux" />
      <HotelExperienceSection experiences={experiences} />
      <HotelEventsSection events={events} />
      <HotelServiceSection 
        services={additionalServices} 
        title="Services additionnels" 
        bgColor="bg-gray-50" 
      />
      <HotelAssistanceSection assistance={assistance} />
    </div>
  );
};

export default HotelView;
