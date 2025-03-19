
import React, { useEffect, useState } from 'react';
import { UtensilsCrossed, Heart, Info, Phone } from 'lucide-react';
import ServiceCard from './ServiceCard';
import { supabase } from '@/integrations/supabase/client';

// Types for the data
interface HotelAbout {
  id: string;
  hotel_id: string;
  title: string;
  description: string;
  icon: string;
  action_text: string;
  action_link: string;
  status: string;
}

// Types for services
interface HotelService {
  id: string;
  hotel_id: string;
  title: string;
  description: string;
  icon: string;
  action_text: string;
  action_link: string;
  status: string;
  type: string;
  display_order: number;
}

// Function to get the corresponding Lucide icon
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Info':
      return <Info className="w-6 h-6 text-primary" />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className="w-6 h-6 text-primary" />;
    case 'Phone':
      return <Phone className="w-6 h-6 text-primary" />;
    case 'Heart':
      return <Heart className="w-6 h-6 text-primary" />;
    default:
      return <Info className="w-6 h-6 text-primary" />;
  }
};

const MainServicesSection = () => {
  // State to store data
  const [aboutUs, setAboutUs] = useState<HotelAbout | null>(null);
  const [services, setServices] = useState<HotelService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Function to load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // For now, we use a fixed hotel (for testing)
        // In a complete implementation, this ID would be determined
        // based on the logged-in user or a URL parameter
        const hotelId = '00000000-0000-0000-0000-000000000000'; // To be replaced with a real ID during testing
        
        // Try to get About Us data
        const aboutResponse = await fetch(`${supabase.supabaseUrl}/rest/v1/hotel_about?hotel_id=eq.${hotelId}&select=*`, {
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`
          }
        });
        
        if (!aboutResponse.ok) {
          console.error('Error fetching About Us data:', aboutResponse.statusText);
        } else {
          const aboutData = await aboutResponse.json();
          if (aboutData && aboutData.length > 0) {
            setAboutUs(aboutData[0]);
          }
        }
        
        // Try to get main services
        const servicesResponse = await fetch(`${supabase.supabaseUrl}/rest/v1/hotel_services?hotel_id=eq.${hotelId}&type=eq.main&select=*&order=display_order.asc`, {
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`
          }
        });
        
        if (!servicesResponse.ok) {
          console.error('Error fetching services:', servicesResponse.statusText);
        } else {
          const servicesData = await servicesResponse.json();
          setServices(servicesData || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An error occurred while loading data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Display a loader during loading
  if (loading) {
    return (
      <section className="px-6 mb-10">
        <h2 className="text-2xl font-bold text-secondary mb-4">Main Services</h2>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4 rounded-2xl border border-gray-200 bg-gray-50 animate-pulse h-36"></div>
          ))}
        </div>
      </section>
    );
  }
  
  // Display an error message if necessary
  if (error) {
    console.log("Error loading data:", error);
  }
  
  // If we don't have data in the database yet, use default values
  // This is useful for development and to avoid errors during first deployment
  const defaultServices = [
    {
      icon: 'Info',
      title: 'About Us',
      description: 'Hotel directory and information',
      actionText: 'Learn More',
      actionLink: '/about',
      status: 'Available'
    },
    {
      icon: 'UtensilsCrossed',
      title: 'Gastronomy',
      description: 'Fine dining experiences',
      actionText: 'Reserve Table',
      actionLink: '/dining',
      status: 'Open'
    },
    {
      icon: 'Phone',
      title: 'Concierge',
      description: '24/7 assistance services',
      actionText: 'Contact Now',
      actionLink: '/services',
      status: 'Available'
    },
    {
      icon: 'Heart',
      title: 'Spa & Wellness',
      description: 'Relax and rejuvenate',
      actionText: 'Book Treatment',
      actionLink: '/spa',
      status: 'Available'
    }
  ];
  
  // Combine database data with default values if necessary
  const servicesWithDefaults = services.length > 0 
    ? services 
    : defaultServices.map((service, index) => ({
        id: `default-${index}`,
        hotel_id: '',
        title: service.title,
        description: service.description,
        icon: service.icon,
        action_text: service.actionText,
        action_link: service.actionLink,
        status: service.status,
        type: 'main',
        display_order: index
      }));
      
  // Add About Us at the beginning if available
  if (aboutUs) {
    // Check if about us already exists in the services
    const aboutExists = servicesWithDefaults.some(s => s.title === aboutUs.title);
    
    if (!aboutExists) {
      // Replace the first service (which would typically be About Us) with data from the database
      servicesWithDefaults[0] = {
        id: aboutUs.id,
        hotel_id: aboutUs.hotel_id,
        title: aboutUs.title,
        description: aboutUs.description,
        icon: aboutUs.icon,
        action_text: aboutUs.action_text,
        action_link: aboutUs.action_link,
        status: aboutUs.status,
        type: 'main',
        display_order: 0
      };
    }
  }
  
  return (
    <section className="px-6 mb-10">
      <h2 className="text-2xl font-bold text-secondary mb-4">Main Services</h2>
      <div className="grid grid-cols-2 gap-4">
        {servicesWithDefaults.map((service) => (
          <ServiceCard 
            key={service.id}
            icon={getIconComponent(service.icon)}
            title={service.title}
            description={service.description}
            actionText={service.action_text}
            actionLink={service.action_link}
            status={service.status}
          />
        ))}
      </div>
    </section>
  );
};

export default MainServicesSection;
