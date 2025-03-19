
import React, { useEffect, useState } from 'react';
import { UtensilsCrossed, Heart, Info, Phone } from 'lucide-react';
import ServiceCard from './ServiceCard';
import { supabase } from '@/integrations/supabase/client';

// Type pour les données de About Us
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

// Types pour les services
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

// Fonction utilitaire pour obtenir l'icône Lucide correspondante
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
  // État pour stocker les données
  const [aboutUs, setAboutUs] = useState<HotelAbout | null>(null);
  const [services, setServices] = useState<HotelService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fonction pour charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Pour l'instant, on utilise un hôtel fixe (pour test)
        // Dans une implémentation complète, cet ID serait déterminé
        // en fonction de l'utilisateur connecté ou d'un paramètre d'URL
        const hotelId = '00000000-0000-0000-0000-000000000000'; // À remplacer par un ID réel lors du test
        
        // Récupérer les données About Us
        const { data: aboutData, error: aboutError } = await supabase
          .from('hotel_about')
          .select('*')
          .eq('hotel_id', hotelId)
          .single();
          
        if (aboutError) {
          console.error('Erreur lors de la récupération des données About Us:', aboutError);
          // Si aucune donnée n'existe encore, on continue sans erreur
          if (aboutError.code !== 'PGRST116') {
            setError(aboutError.message);
          }
        } else {
          setAboutUs(aboutData);
        }
        
        // Récupérer les services principaux
        const { data: servicesData, error: servicesError } = await supabase
          .from('hotel_services')
          .select('*')
          .eq('hotel_id', hotelId)
          .eq('type', 'main')
          .order('display_order', { ascending: true });
          
        if (servicesError) {
          console.error('Erreur lors de la récupération des services:', servicesError);
          setError(servicesError.message);
        } else {
          setServices(servicesData || []);
        }
      } catch (err) {
        console.error('Erreur inattendue:', err);
        setError('Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Afficher un loader pendant le chargement
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
  
  // Afficher un message d'erreur si nécessaire
  if (error) {
    console.log("Erreur lors du chargement des données:", error);
  }
  
  // Si nous n'avons pas encore de données dans la base, utiliser des valeurs par défaut
  // C'est utile pour le développement et pour éviter les erreurs lors du premier déploiement
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
  
  // Combiner les données de la base avec les valeurs par défaut si nécessaire
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
      
  // Ajouter About Us au début si disponible
  if (aboutUs) {
    // Vérifier si about us existe déjà dans les services
    const aboutExists = servicesWithDefaults.some(s => s.title === aboutUs.title);
    
    if (!aboutExists) {
      // Remplacer le premier service (qui serait généralement About Us) par les données de la base
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
