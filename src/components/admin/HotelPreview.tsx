
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HotelAbout, HotelService } from '@/hooks/useActiveHotel';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import HeroSectionWithProps from '../home/HeroSectionWithProps';
import AboutSection from '../home/AboutSection';
import { cn } from '@/lib/utils';

interface HotelPreviewProps {
  hotelName: string;
  hotelAddress: string;
  aboutSections: HotelAbout[];
  backgroundImage?: string;
  className?: string;
}

const HotelPreview = ({ 
  hotelName, 
  hotelAddress, 
  aboutSections, 
  backgroundImage,
  className 
}: HotelPreviewProps) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute right-4 top-4 z-10">
        <Button asChild variant="outline" className="gap-2 bg-white">
          <Link to="/" target="_blank">
            <Eye className="h-4 w-4" />
            Voir le site
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden border-none shadow-md">
        <CardContent className="p-0">
          <div className="transform scale-[0.85] origin-top rounded-lg overflow-hidden border shadow-lg">
            <div className="h-[250px]">
              <HeroSectionWithProps
                title={hotelName}
                subtitle={hotelAddress}
                backgroundImage={backgroundImage}
                preview={true}
              />
            </div>
            
            {aboutSections.length > 0 && (
              <div className="bg-white py-4">
                <AboutSection sections={aboutSections} className="transform scale-90" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HotelPreview;
