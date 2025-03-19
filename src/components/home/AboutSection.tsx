
import React from 'react';
import { 
  Info, 
  Coffee, 
  Landmark, 
  Wifi, 
  Utensils, 
  MapPin, 
  Award, 
  History, 
  Heart 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { HotelAbout } from '@/hooks/useActiveHotel';

// Mapping des noms d'icônes de chaîne vers les composants Lucide
const iconMap: Record<string, React.ReactNode> = {
  info: <Info className="h-10 w-10 text-primary" />,
  coffee: <Coffee className="h-10 w-10 text-primary" />,
  landmark: <Landmark className="h-10 w-10 text-primary" />,
  wifi: <Wifi className="h-10 w-10 text-primary" />,
  utensils: <Utensils className="h-10 w-10 text-primary" />,
  map: <MapPin className="h-10 w-10 text-primary" />,
  award: <Award className="h-10 w-10 text-primary" />,
  history: <History className="h-10 w-10 text-primary" />,
  heart: <Heart className="h-10 w-10 text-primary" />,
  // Ajoutez d'autres icônes au besoin
};

interface AboutSectionProps {
  sections: HotelAbout[];
  className?: string;
}

const AboutSection = ({ sections, className }: AboutSectionProps) => {
  if (!sections || sections.length === 0) {
    return null; // Ne rien afficher s'il n'y a pas de sections
  }

  return (
    <section className={cn("py-12 px-4 md:py-16", className)}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => (
            <Card key={section.id} className="overflow-hidden border-none shadow-md">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4">
                  {iconMap[section.icon] || <Info className="h-10 w-10 text-primary" />}
                </div>
                <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                <p className="text-muted-foreground flex-grow mb-4">{section.description}</p>
                <div className="mt-auto">
                  <Button asChild variant="outline" className="w-full">
                    <Link to={section.action_link}>{section.action_text}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
