
import React from 'react';
import { Container } from '@/components/ui/container';
import { HotelService } from '@/hooks/useActiveHotel';
import { motion } from 'framer-motion';
import ServiceCard from '@/components/home/ServiceCard';
import { 
  Coffee, Utensils, Wifi, MapPin, Leaf, 
  HeartPulse, BedDouble, Dumbbell, ParkingSquare,
  Info, UtensilsCrossed, Phone, Heart
} from 'lucide-react';

// Map of icon names to Lucide React components
const iconComponents: Record<string, React.ReactNode> = {
  coffee: <Coffee className="h-6 w-6 text-primary" />,
  utensils: <Utensils className="h-6 w-6 text-primary" />,
  wifi: <Wifi className="h-6 w-6 text-primary" />,
  map: <MapPin className="h-6 w-6 text-primary" />,
  leaf: <Leaf className="h-6 w-6 text-primary" />,
  health: <HeartPulse className="h-6 w-6 text-primary" />,
  bed: <BedDouble className="h-6 w-6 text-primary" />,
  gym: <Dumbbell className="h-6 w-6 text-primary" />,
  parking: <ParkingSquare className="h-6 w-6 text-primary" />,
  Info: <Info className="h-6 w-6 text-primary" />,
  UtensilsCrossed: <UtensilsCrossed className="h-6 w-6 text-primary" />,
  Phone: <Phone className="h-6 w-6 text-primary" />,
  Heart: <Heart className="h-6 w-6 text-primary" />,
};

interface HomeServicesSectionProps {
  services: HotelService[];
  type: 'main' | 'additional';
  title: string;
  description: string;
  className?: string;
}

const HomeServicesSection: React.FC<HomeServicesSectionProps> = ({
  services,
  type,
  title,
  description,
  className = '',
}) => {
  // Filter services by type
  const filteredServices = services.filter((service) => service.type === type);

  if (filteredServices.length === 0) {
    return null;
  }

  return (
    <section className={`py-6 ${className}`}>
      <Container>
        <div className="mb-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-secondary mb-2"
          >
            {title}
          </motion.h2>
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground"
            >
              {description}
            </motion.p>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <ServiceCard
                icon={iconComponents[service.icon] || iconComponents.coffee}
                title={service.title}
                description={service.description}
                actionText={service.action_text}
                actionLink={service.action_link}
                status={service.status}
                highlighted={index === 0}
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default HomeServicesSection;
