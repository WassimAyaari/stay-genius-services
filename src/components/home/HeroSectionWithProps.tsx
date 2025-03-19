
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  preview?: boolean;
}

const HeroSectionWithProps = ({ 
  title, 
  subtitle, 
  backgroundImage = '/lovable-uploads/298d1ba4-d372-413d-9386-a531958ccd9c.png',
  preview = false
}: HeroSectionProps) => {
  return (
    <div className={`relative ${preview ? 'h-full' : 'h-[500px] md:h-[600px]'} overflow-hidden`}>
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          opacity: 0.9
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
      
      <div className="relative h-full container mx-auto flex flex-col justify-center items-center text-center px-4">
        <motion.div
          initial={preview ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white max-w-3xl"
        >
          <h1 className={`${preview ? 'text-2xl md:text-3xl' : 'text-3xl md:text-5xl'} font-bold mb-4`}>{title}</h1>
          <p className={`${preview ? 'text-base md:text-lg' : 'text-lg md:text-xl'} mb-8 opacity-90`}>{subtitle}</p>
          
          {!preview && (
            <>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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
              
              <div className="relative max-w-md mx-auto mt-8">
                <Input
                  type="search"
                  placeholder="Search for services, activities, or amenities..."
                  className="w-full pl-12 pr-4 py-3 rounded-full text-base bg-white shadow-lg border-none"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSectionWithProps;
