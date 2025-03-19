
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Utensils, 
  Bed, 
  Spa as SpaIcon, 
  MapPin, 
  ShoppingBag,
  Calendar,
  MessageSquare,
  Phone
} from 'lucide-react';
import { HotelService } from '@/hooks/useActiveHotel';

// Mapping des noms d'icônes en chaîne vers les composants Lucide
const iconMap: Record<string, React.ReactNode> = {
  utensils: <Utensils className="h-6 w-6" />,
  bed: <Bed className="h-6 w-6" />,
  spa: <SpaIcon className="h-6 w-6" />,
  map: <MapPin className="h-6 w-6" />,
  shopping: <ShoppingBag className="h-6 w-6" />,
  calendar: <Calendar className="h-6 w-6" />,
  message: <MessageSquare className="h-6 w-6" />,
  phone: <Phone className="h-6 w-6" />,
  // Ajoutez d'autres icônes au besoin
};

interface ServiceCardProps {
  service: HotelService;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center text-center transition-all hover:shadow-lg">
      <div className="rounded-full bg-primary/10 p-4 mb-4">
        {iconMap[service.icon] || <Utensils className="h-6 w-6 text-primary" />}
      </div>
      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
      <div className="mt-auto pt-4">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to={service.action_link}>{service.action_text}</Link>
        </Button>
      </div>
    </div>
  );
};

interface HomeServicesSectionProps {
  services: HotelService[];
  type: 'main' | 'additional';
  title: string;
  description?: string;
  className?: string;
}

const HomeServicesSection = ({ 
  services, 
  type, 
  title, 
  description, 
  className 
}: HomeServicesSectionProps) => {
  // Filtrer les services par type
  const filteredServices = services.filter(service => service.type === type);
  
  if (!filteredServices || filteredServices.length === 0) {
    return null; // Ne rien afficher s'il n'y a pas de services
  }

  return (
    <section className={cn("py-12 px-4", className)}>
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
          {description && <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeServicesSection;
