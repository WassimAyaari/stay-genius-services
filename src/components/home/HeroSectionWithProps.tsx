
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
}

const HeroSectionWithProps = ({ 
  title, 
  subtitle, 
  backgroundImage = '/lovable-uploads/298d1ba4-d372-413d-9386-a531958ccd9c.png' 
}: HeroSectionProps) => {
  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-gray-900">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          opacity: 0.6
        }}
      />
      
      <div className="relative h-full container mx-auto flex flex-col justify-center items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white max-w-3xl"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">{subtitle}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/rooms">
                Réserver une chambre
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
              <Link to="/services">
                Découvrir les services
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSectionWithProps;
